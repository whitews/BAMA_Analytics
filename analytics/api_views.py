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

from analytics.serializers import *


def custom_exception_handler(exc):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    if isinstance(exc, NotAuthenticated):
        response = Response(
            {'detail': 'Not authenticated'},
            status=status.HTTP_401_UNAUTHORIZED,
            exception=True
        )
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
        'analytes': reverse('analyte-list', request=request),
        'conjugates': reverse('conjugate-list', request=request),
        'buffers': reverse('buffer-list', request=request),
        'isotypes': reverse('isotype-list', request=request),
        'sample-types': reverse('sample-type-list', request=request),
    })


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


class AnalyteList(generics.ListCreateAPIView):
    """
    API endpoint representing a list of analytes.
    """

    model = Analyte
    serializer_class = AnalyteSerializer
    filter_fields = ('name', 'subtrahend')

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(AnalyteList, self).post(request, *args, **kwargs)
        return response


class AnalyteDetail(
        AdminRequiredMixin,
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


class ConjugateList(generics.ListCreateAPIView):
    """
    API endpoint representing a list of conjugates.
    """

    model = Conjugate
    serializer_class = ConjugateSerializer
    filter_fields = ('name',)

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(ConjugateList, self).post(request, *args, **kwargs)
        return response


class ConjugateDetail(
        AdminRequiredMixin,
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


class BufferList(generics.ListCreateAPIView):
    """
    API endpoint representing a list of buffers.
    """

    model = Buffer
    serializer_class = BufferSerializer
    filter_fields = ('name',)

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(BufferList, self).post(request, *args, **kwargs)
        return response


class BufferDetail(
        AdminRequiredMixin,
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


class IsotypeList(generics.ListCreateAPIView):
    """
    API endpoint representing a list of isotypes.
    """

    model = Isotype
    serializer_class = IsotypeSerializer
    filter_fields = ('name',)

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(IsotypeList, self).post(request, *args, **kwargs)
        return response


class IsotypeDetail(
        AdminRequiredMixin,
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


class SampleTypeList(generics.ListCreateAPIView):
    """
    API endpoint representing a list of isotypes.
    """

    model = SampleType
    serializer_class = SampleTypeSerializer
    filter_fields = ('name',)

    def post(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        response = super(SampleTypeList, self).post(request, *args, **kwargs)
        return response


class SampleTypeDetail(
        AdminRequiredMixin,
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
