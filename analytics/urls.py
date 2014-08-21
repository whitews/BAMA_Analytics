from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from analytics.api_views import *

# API routes
urlpatterns = patterns('analytics.api_views',
    url(r'^api/analytics/?$', 'analytics_api_root', name='analytics-api-root'),
    url(r'^api/repository/projects/?$', ProjectList.as_view(),
        name='project-list'),
    url(r'^api/analytics/projects/(?P<pk>\d+)/?$', ProjectDetail.as_view(),
        name='project-detail'),

)

# Non-API routes
urlpatterns += patterns('analytics.views',
    url(r'^403$', 'permission_denied', name='permission_denied'),
    url(r'^warning$', TemplateView.as_view(template_name='warning.html'), name='warning_page'),
    url(r'^$', 'analytics_app', name='home'),
)