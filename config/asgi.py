import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from api.consumers import SOSConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Ithu mukkiyam! Django setup aaganum (AppRegistryNotReady fix)
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/sos/', SOSConsumer.as_asgi()),
        ])
    ),
})