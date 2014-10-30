from rest_framework import generics, status
from rest_framework.authentication import \
    SessionAuthentication, \
    TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import \
    authentication_classes, \
    permission_classes, \
    api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.exceptions import NotAuthenticated

import django_filters

from django.views.generic.detail import SingleObjectMixin
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db import transaction


from analytics.serializers import *


def custom_exception_handler(exc):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    if isinstance(exc, NotAuthenticated):
        response = Response({'detail': 'Not authenticated'},
                        status=status.HTTP_401_UNAUTHORIZED,
                        exception=True)
    else:
        response = exception_handler(exc)

    return response


@api_view(['GET'])
@authentication_classes((SessionAuthentication, TokenAuthentication))
@permission_classes((IsAuthenticated,))
def analytics_api_root(request):
    """
    The entry endpoint of our API.
    """

    return Response({
        'cohorts': reverse('cohort-list', request=request),
        'projects': reverse('project-list', request=request),
        'analytes': reverse('analyte-list', request=request),
        'conjugates': reverse('conjugate-list', request=request),
        'buffers': reverse('buffer-list', request=request),
        'isotypes': reverse('isotype-list', request=request),
        'sample-types': reverse('sample-type-list', request=request),
        'notebooks': reverse('notebook-list', request=request),
        'networks': reverse('network-list', request=request),
        'participants': reverse('participant-list', request=request),
        'data-points': reverse('data-point-list', request=request),
    })


@api_view(['GET'])
@authentication_classes((SessionAuthentication, TokenAuthentication))
@permission_classes((IsAuthenticated,))
def get_cohort_permissions(request, cohort):
    cohort = get_object_or_404(Cohort, pk=cohort)

    if not cohort.has_view_permission(request.user):
        raise PermissionDenied

    perms = cohort.get_user_permissions(request.user)

    return Response(perms)


class LoginRequiredMixin(object):
    """
    View mixin to verify a user is logged in.
    """

    authentication_classes = (SessionAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)


class AdminRequiredMixin(object):
    """
    View mixin to verify a user is an administrator.
    """

    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated, IsAdminUser)


class PermissionRequiredMixin(SingleObjectMixin):
    """
    View mixin to verify a user has permission to a resource.
    """

    def get_object(self, *args, **kwargs):
        # TODO: see if we can check HTTP method (GET, PUT, etc.) to reduce
        # duplicate code for modifying resources
        obj = super(PermissionRequiredMixin, self).get_object(*args, **kwargs)
        if hasattr(self, 'request'):
            request = self.request
        else:
            raise PermissionDenied

        if isinstance(obj, ProtectedModel):
            if not obj.has_view_permission(request.user):
                raise PermissionDenied

        return obj


@api_view(['GET'])
@authentication_classes((SessionAuthentication, TokenAuthentication))
@permission_classes((IsAuthenticated,))
def get_user_details(request):
    return Response(
        {
            'username': request.user.username,
            'email': request.user.email,
            'superuser': request.user.is_superuser,
            'staff': request.user.is_staff
        }
    )


class NetworkList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of networks.
    """

    model = Network
    serializer_class = NetworkSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's networks.
        """
        return Network.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(NetworkList, self).post(request, *args, **kwargs)
        return response


class NetworkDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single network.
    """

    model = Network
    serializer_class = NetworkSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super(NetworkDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super(NetworkDetail, self).delete(request, *args, **kwargs)


class CohortList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of cohorts.
    """

    model = Cohort
    serializer_class = CohortSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's cohorts.
        """
        return Cohort.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(CohortList, self).post(request, *args, **kwargs)
        return response


class CohortDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single cohort.
    """

    model = Cohort
    serializer_class = CohortSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super(CohortDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super(CohortDetail, self).delete(request, *args, **kwargs)


class ProjectList(LoginRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of projects.
    """

    model = Project
    serializer_class = ProjectSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's projects.
        """
        queryset = Project.objects.get_projects_user_can_view(self.request.user)
        return queryset

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(ProjectList, self).post(request, *args, **kwargs)
        return response


class ProjectDetail(
        LoginRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single project.
    """

    model = Project
    serializer_class = ProjectSerializer

    def put(self, request, *args, **kwargs):
        project = Project.objects.get(id=kwargs['pk'])
        if not project.has_modify_permission(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super(ProjectDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        project = Project.objects.get(id=kwargs['pk'])
        if not project.has_modify_permission(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super(ProjectDetail, self).delete(request, *args, **kwargs)


class AnalyteList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of analytes.
    """

    model = Analyte
    serializer_class = AnalyteSerializer
    filter_fields = ('name', 'subtrahend')

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's cohorts.
        """
        return Analyte.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(AnalyteList, self).post(request, *args, **kwargs)
        return response


class AnalyteDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single analyte.
    """

    model = Analyte
    serializer_class = AnalyteSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(AnalyteDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(AnalyteDetail, self).delete(request, *args, **kwargs)


class ConjugateList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of conjugates.
    """

    model = Conjugate
    serializer_class = ConjugateSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's cohorts.
        """
        return Conjugate.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(ConjugateList, self).post(request, *args, **kwargs)
        return response


class ConjugateDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single conjugate.
    """

    model = Conjugate
    serializer_class = ConjugateSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(ConjugateDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(ConjugateDetail, self).delete(request, *args, **kwargs)


class BufferList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of buffers.
    """

    model = Buffer
    serializer_class = BufferSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's cohorts.
        """
        return Buffer.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(BufferList, self).post(request, *args, **kwargs)
        return response


class BufferDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single buffer.
    """

    model = Buffer
    serializer_class = BufferSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(BufferDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(BufferDetail, self).delete(request, *args, **kwargs)


class IsotypeList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of isotypes.
    """

    model = Isotype
    serializer_class = IsotypeSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's cohorts.
        """
        return Isotype.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(IsotypeList, self).post(request, *args, **kwargs)
        return response


class IsotypeDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single isotype.
    """

    model = Isotype
    serializer_class = IsotypeSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(IsotypeDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(IsotypeDetail, self).delete(request, *args, **kwargs)


class SampleTypeList(AdminRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of isotypes.
    """

    model = SampleType
    serializer_class = SampleTypeSerializer
    filter_fields = ('name',)

    def get_queryset(self):
        """
        Override .get_queryset() to filter on user's cohorts.
        """
        return SampleType.objects.all()

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(SampleTypeList, self).post(request, *args, **kwargs)
        return response


class SampleTypeDetail(
        AdminRequiredMixin,
        PermissionRequiredMixin,
        generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint representing a single isotype.
    """

    model = SampleType
    serializer_class = SampleTypeSerializer

    def put(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(SampleTypeDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
    
        return super(SampleTypeDetail, self).delete(request, *args, **kwargs)


class NotebookList(LoginRequiredMixin, generics.ListAPIView):
    """
    API endpoint representing a list of notebooks.
    """

    model = Notebook
    serializer_class = NotebookSerializer
    filter_fields = ('name',)


class ParticipantList(LoginRequiredMixin, generics.ListAPIView):
    """
    API endpoint representing a list of participants.
    """

    model = Participant
    serializer_class = ParticipantSerializer
    filter_fields = ('cohort', 'species')


class DataPointFilter(django_filters.FilterSet):
    participant = django_filters.ModelMultipleChoiceFilter(
        queryset=Participant.objects.all(),
        name='participant')
    participant_code = django_filters.CharFilter(
        name='participant__code'
    )
    cohort = django_filters.ModelChoiceFilter(
        queryset=Cohort.objects.all(),
        name='participant__cohort_id'
    )
    analyte = django_filters.ModelMultipleChoiceFilter(
        queryset=Analyte.objects.all(),
        name='analyte')

    class Meta:
        model = DataPoint


class DataPointList(LoginRequiredMixin, generics.ListCreateAPIView):
    """
    API endpoint representing a list of data points.
    """

    model = DataPoint
    serializer_class = DataPointSerializer
    filter_class = DataPointFilter

    def create(self, request, *args, **kwargs):
        data = request.DATA

        # get cohort from first data point
        try:
            cohort = Cohort.objects.get(name=data[0]['cohort'])
        except Exception as e:
            print e
            return Response(data={'detail': e.message}, status=400)

        # verify user has add permission for cohort
        if not cohort.has_add_permission(request.user):
            return Response(
                data={'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        # using an atomic transaction to create intermediate model instances
        try:
            with transaction.atomic():
                # create upload event
                upload_event = UploadEvent(user=request.user)
                upload_event.clean()
                upload_event.save()

                # distinct set of new notebooks by notebook name, value is
                # the provisional Notebook object
                new_notebooks = dict()

                # distinct set of new participants by part code, value is
                # the provisional Participant object
                new_participants = dict()

                for d in data:
                    d['upload_event'] = upload_event.id

                    # check for and create any new notebooks
                    if d['notebook'] is None:
                        if d['notebook_name'] not in new_notebooks.keys():
                            notebook = Notebook(name=d['notebook_name'])
                            notebook.clean()
                            notebook.save()

                            # notebook PK to our data point for saving later
                            d['notebook'] = notebook.id

                            # add to our dict so we don't recreate it
                            new_notebooks[notebook.name] = notebook
                        else:
                            # we've already created a new notebook during this
                            # upload event so just grab it's id for the data
                            # point
                            d['notebook'] = new_notebooks[d['notebook_name']].id

                    # check for and create any new participants
                    if d['participant'] is None:
                        if d['participant_code'] not in new_participants.keys():
                            participant = Participant(
                                cohort=cohort,
                                code=d['participant_code'],
                                species=Species.objects.get(name=d['species'])
                            )
                            participant.clean()
                            participant.save()

                            # participant PK to our data point for saving later
                            d['participant'] = participant.id

                            # add to our dict so we don't recreate it
                            new_participants[participant.code] = participant
                        else:
                            # we've already created a new participant during this
                            # upload event so just grab it's id for the data
                            # point
                            d['participant'] = new_participants[
                                d['participant_code']].id

                    new_dp = DataPoint(
                        upload_event_id=d['upload_event'],
                        notebook_id=d['notebook'],
                        participant_id=d['participant'],
                        sample_type_id=d['sample_type'],
                        analyte_id=d['analyte'],
                        isotype_id=d['isotype'],
                        conjugate_id=d['conjugate'],
                        buffer_id=d['buffer'],
                        global_id_code=d['global_id_code'],
                        visit_code=d['visit_code'],
                        visit_date=d['visit_date'],
                        assay_date=d['assay_date'],
                        bead_number=d['bead_number'],
                        dilution=d['dilution'],
                        fi_minus_background=d['fi_minus_background'],
                        fi_minus_background_blank=d['fi_minus_background_blank'],
                        cv=d['cv'],
                    )
                    new_dp.clean()
                    new_dp.save()
        except IntegrityError as e:
            print e
            e.message = "Duplicate data point found: " + \
                "Notebook=" + d["notebook_name"] + \
                ", Participant=" + d["participant_code"] + \
                ", Visit=" + new_dp.visit_code + \
                ", Analyte=" + new_dp.analyte.name + \
                ", Isotype=" + new_dp.isotype.name + \
                ", Conjugate=" + new_dp.conjugate.name
            return Response(data={'detail': e.message}, status=400)
            
        except Exception as e:  # catch any exception to rollback changes
            print e
            return Response(data={'detail': e.message}, status=400)

        # possibly put this in the atomic transaction above
        serializer = self.get_serializer(data=request.DATA, many=True)
        if serializer.is_valid():
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)