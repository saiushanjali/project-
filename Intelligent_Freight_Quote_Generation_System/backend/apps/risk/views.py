from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from apps.risk.services import ShipmentRiskEngine

class RiskAssessmentView(APIView):
    """
    POST /api/v1/risk/assess/
    Evaluates weather risk, customs compliance, route risk, port risk, cargo risk, and overall shipment risk.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data or {}
        origin = data.get('origin', data.get('origin_code', 'INMAA'))
        dest = data.get('destination', data.get('destination_code', 'INNSA'))
        ready_date = data.get('ready_date', data.get('shipment_date', None))
        mode = data.get('mode', data.get('transport_mode', 'OCEAN'))
        cargo_type = data.get('cargo_type', 'STANDARD')
        incoterm = data.get('incoterm', 'FOB')
        hs_code = data.get('hs_code', '8471.30.00')
        declared_val = float(data.get('declared_value', 0.0))
        is_haz = bool(data.get('is_hazardous', False))
        is_rfr = bool(data.get('is_reefer', False))
        uploaded_docs = data.get('uploaded_doc_codes', ['BOL', 'INV'])

        res = ShipmentRiskEngine.calculate_composite_risk(
            origin_code=origin,
            dest_code=dest,
            ready_date=ready_date,
            transport_mode=mode,
            cargo_type=cargo_type,
            incoterm=incoterm,
            hs_code=hs_code,
            declared_value=declared_val,
            is_hazardous=is_haz,
            is_reefer=is_rfr,
            uploaded_doc_codes=uploaded_docs
        )

        return Response({'success': True, 'data': res})



class WeatherRiskView(APIView):
    """
    POST /api/v1/risk/weather/
    Evaluates Weather Intelligence risk for specified route & shipment date.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from apps.risk.weather_service import WeatherIntelligenceService
        data = request.data or {}
        origin = data.get('origin', data.get('origin_code', 'INMAA'))
        dest = data.get('destination', data.get('destination_code', 'INNSA'))
        ready_date = data.get('ready_date', data.get('shipment_date', None))
        mode = data.get('mode', data.get('transport_mode', 'OCEAN'))
        cargo_type = data.get('cargo_type', 'STANDARD')
        is_reefer = bool(data.get('is_reefer', False))

        res = WeatherIntelligenceService.calculate_weather_risk(
            origin_code=origin,
            dest_code=dest,
            ready_date=ready_date,
            transport_mode=mode,
            cargo_type=cargo_type,
            is_reefer=is_reefer
        )

        return Response({'success': True, 'data': res})


class CustomsComplianceView(APIView):
    """
    POST /api/v1/risk/customs/
    Evaluates Customs Intelligence, HS Code validity, document checklists, and readiness scores.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from apps.risk.customs_service import CustomsComplianceEngine
        data = request.data or {}
        origin = data.get('origin', data.get('origin_code', 'INMAA'))
        dest = data.get('destination', data.get('destination_code', 'INNSA'))
        hs_code = data.get('hs_code', '8471.30.00')
        commodity = data.get('commodity', 'Commercial Export Goods')
        mode = data.get('mode', data.get('transport_mode', 'OCEAN'))
        cargo_type = data.get('cargo_type', 'STANDARD')
        incoterm = data.get('incoterm', 'FOB')
        declared_value = float(data.get('declared_value', 0.0))
        is_haz = bool(data.get('is_hazardous', False))
        is_rfr = bool(data.get('is_reefer', False))
        uploaded_docs = data.get('uploaded_doc_codes', ['BOL', 'INV'])

        res = CustomsComplianceEngine.evaluate_compliance(
            origin_code=origin,
            dest_code=dest,
            hs_code=hs_code,
            commodity=commodity,
            transport_mode=mode,
            cargo_type=cargo_type,
            incoterm=incoterm,
            declared_value=declared_value,
            is_hazardous=is_haz,
            is_reefer=is_rfr,
            uploaded_doc_codes=uploaded_docs
        )

        return Response({'success': True, 'data': res})


