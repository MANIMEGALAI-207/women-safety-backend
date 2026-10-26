from django.urls import path
from . import views

urlpatterns = [
    path('sos/list/', views.sos_list, name='sos_list'),
    path('sos/create/', views.sos_create, name='sos_create'),
    path('sos/<int:sos_id>/resolve/', views.resolve_sos, name='resolve_sos'),
]