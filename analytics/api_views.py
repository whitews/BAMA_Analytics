from rest_framework import generics, status
from rest_framework.authentication import \
    SessionAuthentication, \
    TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import \
    authentication_classes, \
    permission_classes, \
    api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response

from django.views.generic.detail import SingleObjectMixin
from django.core.exceptions import PermissionDenied

from analytics.serializers import *


@api_view(['GET'])
@authentication_classes((SessionAuthentication, TokenAuthentication))
@permission_classes((IsAuthenticated,))
def analytics_api_root(request):
    """
    The entry endpoint of our API.
    """

    return Response({
        'projects': reverse('project-list', request=request),
    })


class LoginRequiredMixin(object):
    """
    View mixin to verify a user is logged in.
    """

    authentication_classes = (SessionAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)


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