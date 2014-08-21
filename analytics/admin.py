from django.contrib import admin

from guardian.admin import GuardedModelAdmin

from analytics.models import *


class ProjectAdmin(GuardedModelAdmin):
    user_can_access_owned_objects_only = True
    pass

admin.site.register(Cohort)
admin.site.register(Project)
admin.site.register(Species)
admin.site.register(Network)
admin.site.register(Participant)
admin.site.register(UploadEvent)
admin.site.register(Notebook)
admin.site.register(Analyte)
admin.site.register(Conjugate)
admin.site.register(Isotype)
admin.site.register(Buffer)
admin.site.register(SampleType)
admin.site.register(DataPoint)
admin.site.register(ProjectDataPoint)