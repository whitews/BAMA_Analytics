from analytics.models import DataPoint
from analytics.serializers import DataPointSerializer
import time
from django.core import serializers


def print_benchmark(start_time):
    print "".join(
        [
            "Serialized data in ",
            str(round(time.time() - start_time, 4)),
            "s"
        ]
    )


def run_benchmarks():
    non_relation_fields = [
        'id',
        'upload_event',
        'notebook',
        'participant',
        'sample_type',
        'analyte',
        'isotype',
        'conjugate',
        'buffer',
        'global_id_code',
        'visit_code',
        'visit_date',
        'assay_date',
        'bead_number',
        'dilution',
        'fi_minus_background',
        'fi_minus_background_blank',
        'cv'
    ]

    related_fields = [
        'notebook__name',
        'participant__code',
        'analyte__name',
        'conjugate__name',
        'buffer__name',
        'isotype__name',
        'sample_type__name',
        'upload_event__upload_date',
        'upload_event__user__username'
    ]

    all_fields = non_relation_fields + related_fields

    start = time.time()
    data1 = serializers.serialize(
        'json',
        DataPoint.objects.all(),
        fields=non_relation_fields
    )
    print_benchmark(start)

    start = time.time()
    data2 = serializers.serialize(
        'json',
        DataPoint.objects.all(),
        fields=all_fields
    )
    print_benchmark(start)

    start = time.time()
    ser1 = DataPointSerializer(DataPoint.objects.all())
    len(ser1.data)
    print_benchmark(start)

    start = time.time()
    ser2 = DataPointSerializer(DataPoint.objects.all().select_related(*related_fields))
    len(ser2.data)
    print_benchmark(start)