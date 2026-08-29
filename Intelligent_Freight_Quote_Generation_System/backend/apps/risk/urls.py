from django.urls import path
from apps.risk.views import RiskAssessmentView, WeatherRiskView, CustomsComplianceView

urlpatterns = [
    path('assess/', RiskAssessmentView.as_view(), name='risk-assess'),
    path('weather/', WeatherRiskView.as_view(), name='risk-weather'),
    path('customs/', CustomsComplianceView.as_view(), name='risk-customs'),
]
