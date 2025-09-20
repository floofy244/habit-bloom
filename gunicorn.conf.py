import os

# Gunicorn configuration for Render deployment
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
workers = 2
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 100
preload_app = True
worker_class = "sync"
worker_connections = 1000

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190
