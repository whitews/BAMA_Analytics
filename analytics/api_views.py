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

from django.views.generic.detail import SingleObjectMixin
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from analytics.serializers import *


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
    filter_fields = ('name')

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
    filter_fields = ('name')

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
    filter_fields = ('name')

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
    filter_fields = ('name')

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


class NetworkList(LoginRequiredMixin, generics.ListAPIView):
    """
    API endpoint representing a list of networks.
    """

    model = Network
    serializer_class = NetworkSerializer
    filter_fields = ('name',)


class ParticipantList(LoginRequiredMixin, generics.ListAPIView):
    """
    API endpoint representing a list of participants.
    """

    model = Participant
    serializer_class = ParticipantSerializer
    filter_fields = ('cohort', 'species', 'network')