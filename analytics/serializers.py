from rest_framework import serializers

from analytics.models import *


class NetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Network


class CohortSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='cohort-detail')
    network_name = serializers.CharField(
        source="network.name",
        read_only=True
    )

    class Meta:
        model = Cohort


class ProjectSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='project-detail')

    class Meta:
        model = Project


class AnalyteSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='analyte-detail')
    subtrahend_name = serializers.CharField(
        source="subtrahend.name",
        read_only=True
    )

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


class IsotypeSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='isotype-detail')

    class Meta:
        model = Isotype


class SampleTypeSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='sample-type-detail')

    class Meta:
        model = SampleType


class NotebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notebook


class ParticipantSerializer(serializers.ModelSerializer):
    cohort_name = serializers.CharField(
        source='cohort.name',
        read_only=True)
    species_name = serializers.CharField(
        source='species.name',
        read_only=True)

    class Meta:
        model = Participant


class DataPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPoint