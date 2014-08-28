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
)

# Non-API routes
urlpatterns += patterns('analytics.views',
    url(r'^403$', 'permission_denied', name='permission_denied'),
    url(r'^warning$', TemplateView.as_view(template_name='warning.html'), name='warning_page'),
    url(r'^$', 'analytics_app', name='home'),
)