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


class AnalyteSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='analyte-detail')
    subtrahend_name = serializers.CharField(source="subtrahend.name")

    class Meta:
        model = Analyte


class ConjugateSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='conjugate-detail')

    class Meta:
        model = Conjugate


class BufferSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='buffer-detail')

    class Meta:
        model = Buffer