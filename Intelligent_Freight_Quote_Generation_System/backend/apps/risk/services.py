"""
Composite Shipment Risk Scoring Engine (Milestone 3)
Aggregates Weather Risk (30%), Customs Compliance Risk (25%), Route Risk (15%),
Port Congestion Risk (15%), and Cargo Volatility Risk (15%) into a single overall score.
Classifies shipments into LOW, MEDIUM, HIGH, or CRITICAL tiers.
"""
from typing import Dict, Any, List
from apps.risk.weather_service import WeatherIntelligenceService
from apps.risk.customs_service import CustomsComplianceEngine


PORT_CONGESTION_INDEX = {
    'INMAA': {'congestion_score': 35.0, 'status': 'MODERATE_CONGESTION'},
    'INNSA': {'congestion_score': 25.0, 'status': 'LOW_CONGESTION'},
    'CNSHA': {'congestion_score': 65.0, 'status': 'HIGH_CONGESTION'},
    'USLAX': {'congestion_score': 70.0, 'status': 'CRITICAL_CONGESTION'},
    'DEHAM': {'congestion_score': 30.0, 'status': 'MODERATE_CONGESTION'},
}


class ShipmentRiskEngine:
    @staticmethod
    def calculate_composite_risk(
        origin_code: str,
        dest_code: str,
        ready_date: str = None,
        transport_mode: str = 'OCEAN',
        cargo_type: str = 'STANDARD',
        incoterm: str = 'FOB',
        hs_code: str = '8471.30.00',
        declared_value: float = 0.0,
        is_hazardous: bool = False,
        is_reefer: bool = False,
        uploaded_doc_codes: List[str] = None
    ) -> Dict[str, Any]:
        origin_u = (origin_code or 'INMAA').strip().upper()
        dest_u = (dest_code or 'INNSA').strip().upper()
        mode_u = (transport_mode or 'OCEAN').strip().upper()
        cargo_u = (cargo_type or 'STANDARD').strip().upper()

        # 1. Weather Risk (30% Weight)
        weather_res = WeatherIntelligenceService.calculate_weather_risk(
            origin_code=origin_u,
            dest_code=dest_u,
            ready_date=ready_date,
            transport_mode=mode_u,
            cargo_type=cargo_u,
            is_reefer=is_reefer
        )
        weather_score = float(weather_res['weather_risk_score'])

        # 2. Customs Risk (25% Weight) - inverted from readiness (100 - readiness)
        customs_res = CustomsComplianceEngine.evaluate_compliance(
            origin_code=origin_u,
            dest_code=dest_u,
            hs_code=hs_code,
            cargo_type=cargo_u,
            incoterm=incoterm,
            declared_value=declared_value,
            is_hazardous=is_hazardous,
            is_reefer=is_reefer,
            uploaded_doc_codes=uploaded_doc_codes
        )
        customs_score = round(100.0 - float(customs_res['customs_readiness_score']), 1)

        # 3. Route Risk (15% Weight) - based on distance and transshipment legs
        if origin_u != dest_u and ('US' in dest_u or 'EU' in dest_u or 'DE' in dest_u):
            route_score = 65.0
        elif 'CN' in dest_u or 'SG' in dest_u:
            route_score = 40.0
        else:
            route_score = 20.0

        # 4. Port Congestion Risk (15% Weight) - average of origin & dest ports
        p_orig = PORT_CONGESTION_INDEX.get(origin_u, {'congestion_score': 25.0})['congestion_score']
        p_dest = PORT_CONGESTION_INDEX.get(dest_u, {'congestion_score': 30.0})['congestion_score']
        port_score = round((p_orig + p_dest) / 2.0, 1)

        # 5. Cargo Risk (15% Weight)
        if is_hazardous or cargo_u == 'HAZARDOUS':
            cargo_score = 80.0
        elif is_reefer or cargo_u == 'PERISHABLE':
            cargo_score = 65.0
        elif cargo_u == 'FRAGILE':
            cargo_score = 55.0
        else:
            cargo_score = 15.0

        # Weighted Composite Formula: 30% Weather + 25% Customs + 15% Route + 15% Port + 15% Cargo
        w_weather = 0.30
        w_customs = 0.25
        w_route = 0.15
        w_port = 0.15
        w_cargo = 0.15

        overall_score = round(
            (weather_score * w_weather) +
            (customs_score * w_customs) +
            (route_score * w_route) +
            (port_score * w_port) +
            (cargo_score * w_cargo),
            1
        )

        # Classification Tiers: LOW (<25), MEDIUM (25-49.9), HIGH (50-69.9), CRITICAL (>=70)
        if overall_score >= 70.0:
            classification = "CRITICAL"
        elif overall_score >= 50.0:
            classification = "HIGH"
        elif overall_score >= 25.0:
            classification = "MEDIUM"
        else:
            classification = "LOW"

        # Factors Contributing Explanation
        factors_explanation = [
            f"Weather Risk ({weather_score}/100, 30% weight): {weather_res['explanation']}",
            f"Customs Risk ({customs_score}/100, 25% weight): {len(customs_res['missing_information_alerts'])} active alerts, readiness status {customs_res['readiness_status']}.",
            f"Route Risk ({route_score}/100, 15% weight): Multi-leg corridor {origin_u} → {dest_u} via {mode_u}.",
            f"Port Congestion ({port_score}/100, 15% weight): Origin ({origin_u}: {p_orig}) and Destination ({dest_u}: {p_dest}) vessel queue index.",
            f"Cargo Fragility ({cargo_score}/100, 15% weight): Cargo type {cargo_u} (Hazmat: {is_hazardous}, Reefer: {is_reefer})."
        ]

        # Actionable recommendations
        recommendations = []
        if weather_score > 40:
            recommendations.append(f"Weather: Add +{weather_res['estimated_delay_days']} days SLA buffer for transit delays.")
        if customs_score > 30:
            recommendations.append("Customs: Upload missing mandatory trade documents prior to gate-in.")
        if port_score > 50:
            recommendations.append("Port Congestion: Request priority offloading window at destination terminal.")
        if is_hazardous:
            recommendations.append("Safety: Ensure IMDG Class stickers and DGD declaration are attached.")

        if not recommendations:
            recommendations.append("Optimal route conditions; no immediate risk intervention required.")

        return {
            'overall_risk_score': overall_score,
            'risk_classification': classification,
            'sub_risk_scores': {
                'weather_risk': weather_score,
                'customs_risk': customs_score,
                'route_risk': route_score,
                'port_congestion_risk': port_score,
                'cargo_risk': cargo_score
            },
            'risk_weights': {
                'weather_pct': 30,
                'customs_pct': 25,
                'route_pct': 15,
                'port_pct': 15,
                'cargo_pct': 15
            },
            'factors_explanation': factors_explanation,
            'recommendations': recommendations,
            'weather_details': weather_res,
            'customs_details': customs_res,
            'requires_manager_review': overall_score >= 50.0
        }
