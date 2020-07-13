# Generated by Django 2.2.12 on 2020-07-08 09:07

from django.db import migrations
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ("destruction", "0004_auto_20200707_1131"),
    ]

    operations = [
        migrations.AlterField(
            model_name="destructionlistitem",
            name="status",
            field=django_fsm.FSMField(
                choices=[
                    ("suggested", "suggested for destruction"),
                    ("removed", "removed from the list during review"),
                    ("processing", "is currently being destroyed"),
                    ("destroyed", "successfully destroyed"),
                    ("failed", "destruction did not succeed"),
                ],
                default="suggested",
                max_length=80,
                verbose_name="status",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="destructionlistitemreview",
            unique_together={("destruction_list_review", "destruction_list_item")},
        ),
    ]
