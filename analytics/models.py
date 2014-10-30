import datetime

from django.db import models, IntegrityError
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from guardian.shortcuts import get_objects_for_user, get_users_with_perms
from guardian.models import UserObjectPermission


class ProtectedModel(models.Model):
    class Meta:
        abstract = True

    def has_view_permission(self, user):
        return False

    def has_add_permission(self, user):
        return False

    def has_modify_permission(self, user):
        return False

    def has_user_management_permission(self, user):
        return False


class Network(models.Model):
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


class CohortManager(models.Manager):
    @staticmethod
    def get_cohorts_user_can_view(user):
        """
        Return a list of cohorts for which the given user has view permissions,
        Do NOT use this method to determine whether a user has view access to a
        particular cohort, use instance method has_view_permission instead.
        """
        cohorts = get_objects_for_user(
            user,
            'view_cohort_data',
            klass=Cohort)

        return cohorts

    @staticmethod
    def get_cohorts_user_can_manage_users(user):
        """
        Return a list of cohorts for which the given user has user management
        permissions.
        """
        cohorts = get_objects_for_user(
            user,
            'manage_cohort_users',
            klass=Cohort)

        return cohorts
    

class Cohort(models.Model):
    network = models.ForeignKey(
        Network,
        null=False,
        blank=False
    )
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

    objects = CohortManager()

    class Meta:
        permissions = (
            ('view_cohort_data', 'View Cohort Data'),
            ('add_cohort_data', 'Add Cohort Data'),
            ('modify_cohort_data', 'Modify/Delete Cohort Data'),
            ('manage_cohort_users', 'Manage Cohort Users'),
        )

    def has_view_permission(self, user):
        if user.has_perm('view_cohort_data', self):
            return True
        return False

    def has_add_permission(self, user):
        if user.has_perm('add_cohort_data', self):
            return True
        return False

    def has_modify_permission(self, user):
        if user.has_perm('modify_cohort_data', self):
            return True
        return False

    def has_user_management_permission(self, user):
        if user.has_perm('manage_cohort_users', self):
            return True
        return False

    def get_cohort_users(self):
        user_set = set()
        user_set.update(get_users_with_perms(self, with_superusers=False))

        return user_set

    def get_user_permissions(self, user):
        perms_dict = {
            'view_cohort_data': self.has_view_permission(user),
            'add_cohort_data': self.has_add_permission(user),
            'modify_cohort_data': self.has_modify_permission(user),
            'manage_cohort_users': self.has_user_management_permission(user)
        }

        return perms_dict


class ProjectManager(models.Manager):
    @staticmethod
    def get_projects_user_can_view(user):
        """
        Return a list of projects for which the given user has view permissions,
        Do NOT use this method to determine whether a user has view access to a
        particular project, use instance method has_view_permission instead.
        """
        projects = get_objects_for_user(
            user,
            'view_project_data',
            klass=Project)

        return projects

    @staticmethod
    def get_projects_user_can_manage_users(user):
        """
        Return a list of projects for which the given user has user management
        permissions.
        """
        projects = get_objects_for_user(
            user,
            'manage_project_users',
            klass=Project)

        return projects


class Project(ProtectedModel):
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

    objects = ProjectManager()

    class Meta:
        permissions = (
            ('view_project_data', 'View Project Data'),
            ('add_project_data', 'Add Project Data'),
            ('modify_project_data', 'Modify/Delete Project Data'),
            ('manage_project_users', 'Manage Project Users'),
        )

    def has_view_permission(self, user):
        if user.has_perm('view_project_data', self):
            return True
        return False

    def has_add_permission(self, user):
        if user.has_perm('add_project_data', self):
            return True
        return False

    def has_modify_permission(self, user):
        if user.has_perm('modify_project_data', self):
            return True
        return False

    def has_user_management_permission(self, user):
        if user.has_perm('manage_project_users', self):
            return True
        return False

    def get_project_users(self):
        user_set = set()
        user_set.update(get_users_with_perms(self, with_superusers=False))

        return user_set

    def get_user_permissions(self, user):
        return UserObjectPermission.objects.filter(
            user=user,
            content_type=ContentType.objects.get_for_model(Project),
            object_pk=self.id)


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


class Participant(models.Model):
    cohort = models.ForeignKey(
        Cohort,
        null=True,
        blank=True
    )
    code = models.CharField(
        max_length=128,
        null=False,
        blank=False
    )
    species = models.ForeignKey(
        Species,
        null=True,
        blank=True
    )

    class Meta:
        unique_together = (('cohort', 'code'),)


class UploadEvent(models.Model):
    upload_date = models.DateField(
        null=False,
        blank=False,
        editable=False
    )
    user = models.ForeignKey(
        User,
        null=False,
        blank=False,
        editable=False
    )

    def save(self, *args, **kwargs):
        """ Populate upload date on save """
        if not self.id:
            self.upload_date = datetime.datetime.today()
            super(UploadEvent, self).save(*args, **kwargs)


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
        null=True,
        blank=True
    )
    global_id_code = models.CharField(
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
    assay_date = models.DateField(
        null=False,
        blank=False
    )
    bead_number = models.IntegerField()
    dilution = models.IntegerField()
    # fi is fluorescence intensity
    fi_minus_background = models.FloatField()
    fi_minus_background_blank = models.FloatField()
    cv = models.FloatField()

    class Meta:
        unique_together = (
            (
                'notebook', 'participant', 'visit_code', 'isotype',
                'dilution', 'conjugate', 'analyte', 'buffer'
            ),
        )


class ProjectDataPoint(models.Model):
    project = models.ForeignKey(Project)
    data_point = models.ForeignKey(DataPoint)