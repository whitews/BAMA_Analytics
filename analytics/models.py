from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType


class Species(models.Model):
    name = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )
    description = models.TextField(
        null=True,
        blank=True
    )


class Analyte(models.Model):
    name = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )
    description = models.TextField(
        null=True,
        blank=True
    )
    subtrahend = models.ForeignKey(
        'self',
        null=True,
        blank=True
    )


class Conjugate(models.Model):
    name = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )
    description = models.TextField(
        null=True,
        blank=True
    )


class Isotype(models.Model):
    name = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )
    description = models.TextField(
        null=True,
        blank=True
    )


class Buffer(models.Model):
    name = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )
    description = models.TextField(
        null=True,
        blank=True
    )


class SampleType(models.Model):
    name = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )
    description = models.TextField(
        null=True,
        blank=True
    )
