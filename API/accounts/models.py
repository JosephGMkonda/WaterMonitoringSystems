from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):

    ROLE_CHOICES = (
        ('reporter', 'Reporter'),
        ('admin', 'Admin')
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='reporter')

    def __str__(self):
        return self.username


