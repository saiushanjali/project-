from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from apps.alerts.services import AlertService

class AlertListView(APIView):
    """
    GET /api/v1/alerts/
    Lists real-time intelligence alerts and notifications.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        alerts = AlertService.get_user_alerts(request.user)
        unack_count = sum(1 for a in alerts if not a.get('acknowledged'))
        return Response({
            'success': True,
            'unacknowledged_count': unack_count,
            'unread_count': unack_count,
            'data': alerts
        })

    def post(self, request):
        data = request.data
        title = data.get('title', 'New Risk Alert')
        alert_type = data.get('alert_type', 'SHIPMENT_RISK')
        severity = data.get('severity', 'HIGH')
        message = data.get('message', 'Risk detected for shipment route.')
        action_link = data.get('action_link', '/dashboard')

        new_alert = AlertService.create_alert(title, alert_type, severity, message, action_link)
        return Response({
            'success': True,
            'data': new_alert
        }, status=status.HTTP_201_CREATED)



class AlertReadView(APIView):
    """
    POST /api/v1/alerts/{id}/read/ or POST /api/v1/alerts/{id}/acknowledge/
    Acknowledges alert notification.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        success = AlertService.acknowledge_alert(pk)
        return Response({
            'success': success,
            'message': f"Alert {pk} acknowledged successfully." if success else "Alert ID not found."
        })

