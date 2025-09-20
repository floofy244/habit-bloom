"""
ASGI config for habitbloom project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'habitbloom.settings')

application = get_asgi_application()
