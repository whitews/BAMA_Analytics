from django.db import models


class Cohort(models.Model):
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


class Project(models.Model):
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


class Participant(models.Model):
    cohort = models.ForeignKey(
        Cohort,
        null=True,
        blank=True
    )
    code = models.CharField(
        unique=True,
        max_length=128,
        null=False,
        blank=False
    )


class ProjectParticipant(models.Model):
    project = models.ForeignKey(Project)
    participant = models.ForeignKey(Participant)


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


class Notebook(models.Model):
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


class UploadEvent(models.Model):
    filename = models.CharField(
        max_length=256,
        null=False,
        blank=False
    )
    upload_date = models.DateField(
        null=False,
        blank=False
    )


class DataPoint(models.Model):
    upload_event = models.ForeignKey(UploadEvent)
    notebook = models.ForeignKey(Notebook)
    participant = models.ForeignKey(Participant)
    sample_type = models.ForeignKey(SampleType)
    analyte = models.ForeignKey(Analyte)
    isotype = models.ForeignKey(Isotype)
    conjugate = models.ForeignKey(Conjugate)
    buffer = models.ForeignKey(
        Buffer,
        null=False,
        blank=False
    )
    global_id_code = models.CharField(
        unique=True,
        max_length=64,
        null=True,
        blank=True
    )
    visit_code = models.CharField(
        max_length=32,
        null=True,
        blank=True
    )
    visit_date = models.DateField(
        null=True,
        blank=True
    )
    bead_number = models.IntegerField()
    dilution = models.IntegerField()
    # fi is fluorescence intensity
    fi_minus_background = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    fi_minus_background_blank = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    cv = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )
