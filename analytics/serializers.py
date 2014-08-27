from rest_framework import serializers

from analytics.models import *


class CohortSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='cohort-detail')

    class Meta:
        model = Cohort
        

class ProjectSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='project-detail')

    class Meta:
        model = Project