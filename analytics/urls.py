from django.conf.urls import patterns, url

from analytics.api_views import *

# API routes
urlpatterns = patterns(
    'analytics.api_views',
    url(r'^api/analytics/?$', 'analytics_api_root', name='analytics-api-root'),
    url(r'^api/analytics/user/?$', get_user_details, name='get_user_details'),
    url(r'^api/analytics/analytes/?$', AnalyteList.as_view(),
        name='analyte-list'),
    url(r'^api/analytics/analytes/(?P<pk>\d+)/?$', AnalyteDetail.as_view(),
        name='analyte-detail'),
    url(r'^api/analytics/conjugates/?$', ConjugateList.as_view(),
        name='conjugate-list'),
    url(r'^api/analytics/conjugates/(?P<pk>\d+)/?$', ConjugateDetail.as_view(),
        name='conjugate-detail'),
    url(r'^api/analytics/buffers/?$', BufferList.as_view(),
        name='buffer-list'),
    url(r'^api/analytics/buffers/(?P<pk>\d+)/?$', BufferDetail.as_view(),
        name='buffer-detail'),
    url(r'^api/analytics/isotypes/?$', IsotypeList.as_view(),
        name='isotype-list'),
    url(r'^api/analytics/isotypes/(?P<pk>\d+)/?$', IsotypeDetail.as_view(),
        name='isotype-detail'),
    url(r'^api/analytics/sample-types/?$', SampleTypeList.as_view(),
        name='sample-type-list'),
    url(r'^api/analytics/sample-types/(?P<pk>\d+)/?$',
        SampleTypeDetail.as_view(),
        name='sample-type-detail'),
)

# Non-API routes
urlpatterns += patterns(
    'analytics.views',
    url(r'^403$', 'permission_denied', name='permission_denied'),
    url(r'^$', 'analytics_app', name='home'),
    url(r'^analytics/admin/$', 'analytics_admin', name='admin'),
)
