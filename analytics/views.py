from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import render_to_response
from django.template import RequestContext


@login_required
def permission_denied(request):
    raise PermissionDenied


@login_required
def analytics_admin(request):
    return render_to_response(
        'analytics_admin.html',
        {},
        context_instance=RequestContext(request)
    )

def analytics_app(request):
    return render_to_response(
        'analytics_app.html',
        {},
        context_instance=RequestContext(request)
    )