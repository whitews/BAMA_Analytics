from django.conf.urls import patterns, url
from django.views.generic import TemplateView


# Non-API routes
urlpatterns = patterns('analytics.views',
    url(r'^403$', 'permission_denied', name='permission_denied'),
    url(r'^warning$', TemplateView.as_view(template_name='warning.html'), name='warning_page'),
    url(r'^$', 'analytics_app', name='home'),
)