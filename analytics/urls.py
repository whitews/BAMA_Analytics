from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from analytics.api_views import *

# API routes
urlpatterns = patterns('analytics.api_views',
    url(r'^api/analytics/?$', 'analytics_api_root', name='analytics-api-root'),
    url(r'^api/analytics/user/?$', get_user_details, name='get_user_details'),
    url(r'^api/analytics/cohorts/?$', CohortList.as_view(),
        name='cohort-list'),
    url(r'^api/analytics/cohorts/(?P<pk>\d+)/?$', CohortDetail.as_view(),
        name='cohort-detail'),
    url(r'^api/analytics/projects/?$', ProjectList.as_view(),
        name='project-list'),
    url(r'^api/analytics/projects/(?P<pk>\d+)/?$', ProjectDetail.as_view(),
        name='project-detail'),
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
)

# Non-API routes
urlpatterns += patterns('analytics.views',
    url(r'^403$', 'permission_denied', name='permission_denied'),
    url(r'^warning$', TemplateView.as_view(template_name='warning.html'), name='warning_page'),
    url(r'^$', 'analytics_app', name='home'),
)