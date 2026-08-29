import math
from decimal import Decimal
from typing import Dict, Any, Optional, List
from core.money import to_decimal, round_money
from ml.pricing_model import pricing_ml_engine, CARGO_MULTIPLIERS, MODE_MULTIPLIERS
from apps.risk.weather_service import WeatherIntelligenceService
from apps.risk.customs_service import CustomsComplianceEngine
from apps.risk.services import ShipmentRiskEngine

CITY_COORDINATES = {
    'chennai': (13.0827, 80.2707),
    'singapore': (1.2902, 103.8519),
    'dubai': (25.0112, 55.0617),
    'colombo': (6.9497, 79.8456),
    'rotterdam': (51.9244, 4.4777),
    'mumbai': (18.9500, 72.9500),
    'nhava sheva': (18.9500, 72.9500),
    'los angeles': (33.7288, -118.2620),
    'shanghai': (31.2243, 121.4691),
    'hamburg': (53.5458, 9.9644),
    'delhi': (28.6139, 77.2090),
    'bengaluru': (12.9716, 77.5946),
    'kolkata': (22.5726, 88.3639),
    'hyderabad': (17.3850, 78.4867),
}

DEFAULT_RATE_CONFIG = {
    'base_rate_per_km': 2.45,
    'fuel_surcharge_pct': 8.5,
    'cargo_multipliers': CARGO_MULTIPLIERS,
    'mode_multipliers': MODE_MULTIPLIERS,
}


def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points in kilometers using Haversine formula."""
    R = 6371.0  # Earth radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)


def get_city_coordinates(name: str) -> tuple:
    norm = name.strip().lower()
    for k, v in CITY_COORDINATES.items():
        if k in norm or norm in k:
            return v
    return (13.0827, 80.2707)  # default Chennai


class PricingService:
    @staticmethod
    def calculate_instant_quote(
        origin: str,
        destination: str,
        weight_kg: float,
        volume_cbm: float,
        ready_date: str = None,
        hs_code: str = '8471.30.00',
        incoterm: str = 'FOB',
        declared_value: float = 0.0,
        cargo_type: str = 'STANDARD',
        transport_mode: str = 'ROAD',
        is_hazardous: bool = False,
        is_reefer: bool = False,
        uploaded_doc_codes: List[str] = None,
        rate_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        cfg = rate_config or DEFAULT_RATE_CONFIG
        base_rate = float(cfg.get('base_rate_per_km', 2.45))
        fuel_pct = float(cfg.get('fuel_surcharge_pct', 8.5))

        c_type = cargo_type.upper()
        t_mode = transport_mode.upper()

        cargo_mult = float(cfg.get('cargo_multipliers', {}).get(c_type, 1.0))
        mode_mult = float(cfg.get('mode_multipliers', {}).get(t_mode, 1.0))

        # 1. Distance Calculation (Haversine)
        coord1 = get_city_coordinates(origin)
        coord2 = get_city_coordinates(destination)
        distance_km = calculate_haversine_distance_km(coord1[0], coord1[1], coord2[0], coord2[1])
        if distance_km < 10.0:
            distance_km = 350.0  # minimum threshold fallback

        # 2. Milestone 1 & 2 Rule-based Calculation (Unchanged)
        base_distance_cost = round(base_rate * distance_km, 2)
        cargo_charge = round(base_distance_cost * (cargo_mult - 1.0), 2)
        mode_adjusted_cost = round((base_distance_cost + cargo_charge) * mode_mult, 2)
        fuel_surcharge = round(mode_adjusted_cost * (fuel_pct / 100.0), 2)
        rule_price = round(mode_adjusted_cost + fuel_surcharge, 2)

        # 3. Milestone 3 ML Price Prediction
        ml_details = pricing_ml_engine.predict_price_with_details(
            distance_km=distance_km,
            weight_kg=weight_kg,
            volume_cbm=volume_cbm,
            cargo_type=c_type,
            transport_mode=t_mode
        )
        ml_price = ml_details['predicted_price']
        variance_pct = round(((ml_price - rule_price) / rule_price) * 100.0, 1)

        # 4. Milestone 3 Weather Risk Intelligence
        weather_res = WeatherIntelligenceService.calculate_weather_risk(
            origin_code=origin,
            dest_code=destination,
            ready_date=ready_date,
            transport_mode=t_mode,
            cargo_type=c_type,
            is_reefer=is_reefer
        )

        # 5. Milestone 3 Customs Compliance Check
        customs_res = CustomsComplianceEngine.evaluate_compliance(
            origin_code=origin,
            dest_code=destination,
            hs_code=hs_code,
            commodity=c_type,
            transport_mode=t_mode,
            cargo_type=c_type,
            incoterm=incoterm,
            declared_value=declared_value,
            is_hazardous=is_hazardous,
            is_reefer=is_reefer,
            uploaded_doc_codes=uploaded_doc_codes
        )

        # 6. Milestone 3 Composite Shipment Risk Engine
        risk_res = ShipmentRiskEngine.calculate_composite_risk(
            origin_code=origin,
            dest_code=destination,
            ready_date=ready_date,
            transport_mode=t_mode,
            cargo_type=c_type,
            incoterm=incoterm,
            hs_code=hs_code,
            declared_value=declared_value,
            is_hazardous=is_hazardous,
            is_reefer=is_reefer,
            uploaded_doc_codes=uploaded_doc_codes
        )

        # 7. Workflow Governance & Quote Issuance Rules
        blocking_reasons: List[str] = []
        if customs_res['customs_readiness_score'] < 30.0:
            blocking_reasons.append(f"Customs Readiness ({customs_res['customs_readiness_score']}%) is below mandatory clearance threshold.")
        if not customs_res['hs_code_analysis']['is_valid']:
            blocking_reasons.append("Invalid or missing 6-digit Harmonized System (HS) Code.")
        if is_hazardous and 'DGD' not in (uploaded_doc_codes or []):
            blocking_reasons.append("Dangerous Goods Declaration (DGD) must be uploaded prior to quote issuance.")

        if blocking_reasons:
            issuance_status = "BLOCKED_RISK_COMPLIANCE"
            can_issue_quote = False
            issuance_narrative = f"Quote issuance blocked due to {len(blocking_reasons)} compliance violation(s)."
        elif risk_res['overall_risk_score'] >= 50.0 or customs_res['readiness_status'] == 'ACTION_REQUIRED':
            issuance_status = "HUMAN_REVIEW_REQUIRED"
            can_issue_quote = True
            issuance_narrative = "Quote generated but requires Manager Approval before final carrier booking."
        else:
            issuance_status = "ISSUED_ACCEPTABLE"
            can_issue_quote = True
            issuance_narrative = "Shipment risk & customs compliance within optimal parameters. Ready for instant issuance."

        return {
            'origin': origin,
            'destination': destination,
            'distance_km': distance_km,
            'weight_kg': weight_kg,
            'volume_cbm': volume_cbm,
            'cargo_type': c_type,
            'transport_mode': t_mode,
            'rule_price': rule_price,
            'ml_price': ml_price,
            'variance_pct': variance_pct,
            'ml_details': ml_details,
            'weather_intelligence': weather_res,
            'customs_intelligence': customs_res,
            'composite_shipment_risk': risk_res,
            'issuance_governance': {
                'status': issuance_status,
                'can_issue_quote': can_issue_quote,
                'narrative': issuance_narrative,
                'blocking_reasons': blocking_reasons
            },
            'breakdown': {
                'base_rate_per_km': base_rate,
                'distance_cost': base_distance_cost,
                'cargo_charge': cargo_charge,
                'cargo_multiplier': cargo_mult,
                'mode_multiplier': mode_mult,
                'fuel_surcharge': fuel_surcharge,
                'fuel_surcharge_pct': fuel_pct,
                'total_price': rule_price
            },
            'status': issuance_status,
            'currency': 'INR',
            'valid_days': 7
        }
