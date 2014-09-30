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
    notebook_name = serializers.CharField(
        source='notebook.name',
        read_only=True)
    participant_code = serializers.CharField(
        source='participant.code',
        read_only=True)
    analyte_name = serializers.CharField(
        source='analyte.name',
        read_only=True)
    conjugate_name = serializers.CharField(
        source='conjugate.name',
        read_only=True)
    buffer_name = serializers.CharField(
        source='buffer.name',
        read_only=True)
    isotype_name = serializers.CharField(
        source='isotype.name',
        read_only=True)
    sample_type_name = serializers.CharField(
        source='sample_type.name',
        read_only=True)
    upload_date = serializers.DateField(
        source='upload_event.upload_date',
        read_only=True)
    user = serializers.CharField(
        source='upload_event.user.username',
        read_only=True)

    class Meta:
        model = DataPoint