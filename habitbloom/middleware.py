dfrom django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.urls import resolve


class CSRFExemptAPI(MiddlewareMixin):
    """
    Middleware to exempt API routes from CSRF protection
    """
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Get the resolved URL name
        try:
            resolver_match = resolve(request.path)
            url_name = resolver_match.url_name
            url_namespace = resolver_match.namespace
        except:
            url_name = None
            url_namespace = None
        
        # Exempt API routes from CSRF
        if request.path.startswith('/api/'):
            return csrf_exempt(view_func)(request, *view_args, **view_kwargs)
        
        # Allow normal CSRF processing for non-API routes
        return None
