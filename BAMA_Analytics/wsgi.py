"""
WSGI config for BAMA_Analytics project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
import sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BAMA_Analytics.settings")
os.environ['PYTHON_EGG_CACHE'] = '/srv/django-projects/python-eggs'

paths = [
    '/srv/django-projects/BAMA_Analytics',
    '/srv/django-projects/BAMA_Analytics/BAMA_Analytics'
]

for path in paths:
    if path not in sys.path:
        sys.path.append(path)

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
