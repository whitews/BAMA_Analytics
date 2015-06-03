from rest_framework import serializers

from analytics.models import *


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
