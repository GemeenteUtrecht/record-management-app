from django.db import models

from rma.accounts.models import User


class DestructionListQuerySet(models.QuerySet):
    def reviewed_by(self, user: User):
        return self.filter(reviews__author=user)
