import logging
import traceback

from django.conf import settings

from celery import chain
from timeline_logger.models import TimelineLog
from zds_client.client import ClientError

from rma.notifications.models import Notification

from ..celery import app
from .constants import ListStatus
from .models import DestructionList, DestructionListItem
from .service import remove_zaak

logger = logging.getLogger(__name__)


@app.task
def process_destruction_list(list_id):
    try:
        destruction_list = DestructionList.objects.get(id=list_id)
    except DestructionList.DoesNotExist:
        logger.warning("Destruction list %r can not be retrieved", list_id)
        return

    if destruction_list.status != ListStatus.in_progress:
        logger.warning("Destruction list %r has been already processed", list_id)
        return

    destruction_list.process()
    destruction_list.save()

    list_item_ids = [
        (list_item.id,) for list_item in destruction_list.items.order_by("id").all()
    ]
    chunk_tasks = process_list_item.chunks(list_item_ids, settings.ZAKEN_PER_TASK)
    notify_task = complete_and_notify.si(list_id)
    chain(chunk_tasks.group(), notify_task)()


@app.task
def process_list_item(list_item_id):
    list_item = DestructionListItem.objects.get(id=list_item_id)
    list_item.process()

    try:
        remove_zaak(list_item.zaak)
    except ClientError as exc:
        logger.warning(
            "Destruction list item %r has failed during execution with error: %r",
            list_item.id,
            exc,
            exc_info=True,
        )

        list_item.fail()
        TimelineLog.objects.create(
            content_object=list_item,
            extra_data={"status": list_item.status, "error": traceback.format_exc(),},
        )
    else:
        list_item.complete()
        TimelineLog.objects.create(
            content_object=list_item, extra_data={"status": list_item.status}
        )

    list_item.save()
    return list_item.status


@app.task
def complete_and_notify(list_id):
    destruction_list = DestructionList.objects.get(id=list_id)

    destruction_list.complete()
    destruction_list.save()

    logger.info("Destruction list %r is processed", destruction_list.id)

    notification = Notification.objects.create(
        destruction_list=destruction_list,
        user=destruction_list.author,
        message="Destruction list has been processed",
    )
    return notification.id