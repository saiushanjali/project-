from django.urls import path
from apps.alerts.views import AlertListView, AlertReadView

urlpatterns = [
    path('', AlertListView.as_view(), name='alert-list'),
    path('<str:pk>/read/', AlertReadView.as_view(), name='alert-read'),
    path('<str:pk>/acknowledge/', AlertReadView.as_view(), name='alert-acknowledge'),
]
