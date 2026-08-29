"""
Weather Intelligence Analysis Module (Milestone 3)
Evaluates route climate zones, severe weather alerts, seasonal monsoon/storm patterns,
delay probabilities, and produces human-readable risk explanations.
Designed with a pluggable provider interface for easy live Weather API integration.
"""
from typing import Dict, Any, List
from datetime import datetime


HIGH_RISK_WEATHER_CORRIDORS = {
    'INMAA-CNSHA': {'risk_tier': 'MODERATE', 'season_peak': 'MONSOON_TYPHOON', 'base_score': 38},
    'INNSA-AEJEA': {'risk_tier': 'LOW', 'season_peak': 'SUMMER_HEAT', 'base_score': 15},
    'INNSA-USLAX': {'risk_tier': 'HIGH', 'season_peak': 'PACIFIC_STORM', 'base_score': 68},
    'INBLR-DEHAM': {'risk_tier': 'MODERATE', 'season_peak': 'WINTER_FREEZE', 'base_score': 42},
    'INMAA-INNSA': {'risk_tier': 'LOW', 'season_peak': 'LOCAL_MONSOON', 'base_score': 25},
}


class WeatherIntelligenceService:
    @staticmethod
    def calculate_weather_risk(
        origin_code: str,
        dest_code: str,
        ready_date: str = None,
        transport_mode: str = 'OCEAN',
        cargo_type: str = 'STANDARD',
        is_reefer: bool = False
    ) -> Dict[str, Any]:
        origin_u = (origin_code or 'INMAA').strip().upper()
        dest_u = (dest_code or 'INNSA').strip().upper()
        mode_u = (transport_mode or 'OCEAN').strip().upper()
        cargo_u = (cargo_type or 'STANDARD').strip().upper()

        # Parse month from ready_date
        month = 8
        shipment_date_str = ready_date or datetime.now().strftime('%Y-%m-%d')
        try:
            dt = datetime.strptime(shipment_date_str[:10], '%Y-%m-%d')
            month = dt.month
        except Exception:
            month = 8

        lane_key = f"{origin_u}-{dest_u}"
        corridor_info = HIGH_RISK_WEATHER_CORRIDORS.get(lane_key, {'risk_tier': 'LOW', 'season_peak': 'NORMAL', 'base_score': 20})

        base_score = corridor_info['base_score']
        severe_conditions: List[str] = []
        warnings: List[str] = []

        # Seasonal adjustments (Monsoon Q3 / Winter Q4)
        if month in [6, 7, 8, 9] and ('IN' in origin_u or 'IN' in dest_u):
            base_score += 18
            severe_conditions.append("South-West Monsoon Swell (Wave Height 3.8m)")
            warnings.append("Monsoon activity in South-Indian maritime corridor may delay port vessel berthing.")

        if month in [11, 12, 1, 2] and ('EU' in dest_u or 'DE' in dest_u or 'US' in dest_u):
            base_score += 16
            severe_conditions.append("Sub-Zero Freezing Blizzard Advisory")
            warnings.append("North Atlantic winter freeze risks inland drayage & rail connection delays.")

        if month in [7, 8, 9] and ('CN' in dest_u or 'JP' in dest_u or 'TW' in dest_u):
            base_score += 22
            severe_conditions.append("Category 2 Typhoon Warning (East China Sea)")
            warnings.append("Tropical storm system approaching destination port container terminals.")

        # Mode specific adjustments
        if mode_u == 'AIR':
            base_score = max(10, int(base_score * 0.65))
            if severe_conditions:
                warnings.append("Flight departures subject to air traffic control weather holds.")
        elif mode_u == 'OCEAN':
            if base_score > 40:
                warnings.append("Vessel speed reduction enforced along transit corridor for crew & cargo safety.")

        # Cargo specific weather sensitivity
        if is_reefer or cargo_u == 'PERISHABLE':
            base_score += 12
            severe_conditions.append("Ambient Extreme Heat Vulnerability")
            warnings.append("Temperature-sensitive cargo: Continuous reefer power monitoring required.")
        elif cargo_u == 'HAZARDOUS':
            base_score += 10
            warnings.append("Hazardous goods: On-deck weather protection and IMDG segregation active.")

        # Cap score between 5 and 100
        final_score = min(100, max(5, base_score))

        if final_score >= 65:
            risk_tier = "HIGH"
        elif final_score >= 35:
            risk_tier = "MODERATE"
        else:
            risk_tier = "LOW"

        delay_prob_pct = min(95.0, round(final_score * 0.85, 1))
        delay_days = round(final_score / 22.0, 1)

        # Generate human-readable clear explanation
        if final_score >= 65:
            explanation = (
                f"HIGH WEATHER RISK (Score: {final_score}/100): Route corridor {origin_u} → {dest_u} for date {shipment_date_str} "
                f"is affected by {', '.join(severe_conditions) if severe_conditions else 'severe weather Systems'}. "
                f"Estimated delay probability is {delay_prob_pct}% with a buffer recommendation of +{delay_days} days."
            )
        elif final_score >= 35:
            explanation = (
                f"MODERATE WEATHER RISK (Score: {final_score}/100): Seasonal atmospheric conditions along {origin_u} → {dest_u} "
                f"indicate a {delay_prob_pct}% chance of minor transit delays (approx. +{delay_days} days buffer)."
            )
        else:
            explanation = (
                f"LOW WEATHER RISK (Score: {final_score}/100): Weather conditions across {origin_u} → {dest_u} are favorable. "
                f"Minimal weather-related delay expected ({delay_prob_pct}% delay probability)."
            )

        # Route segment forecast details
        segment_forecast = [
            {"location": f"Origin Hub ({origin_u})", "condition": "Partly Cloudy", "wind_speed_kts": 12, "temp_c": 31, "status": "OPTIMAL"},
            {"location": "Transit Corridor / Sea", "condition": severe_conditions[0] if severe_conditions else "Fair Seas", "wind_speed_kts": 28 if final_score > 40 else 14, "temp_c": 28, "status": "CAUTION" if final_score > 40 else "OPTIMAL"},
            {"location": f"Destination Port ({dest_u})", "condition": "Clear Skies", "wind_speed_kts": 10, "temp_c": 26, "status": "OPTIMAL"}
        ]

        return {
            'origin_code': origin_u,
            'destination_code': dest_u,
            'shipment_date': shipment_date_str,
            'transport_mode': mode_u,
            'weather_risk_score': final_score,
            'risk_tier': risk_tier,
            'delay_probability_pct': delay_prob_pct,
            'estimated_delay_days': delay_days,
            'severe_weather_conditions': severe_conditions if severe_conditions else ["None reported"],
            'warnings': warnings if warnings else ["Clear skies & normal ocean swell across route."],
            'explanation': explanation,
            'route_segment_forecast': segment_forecast,
            'provider': 'FreightIQ Weather Intelligence Engine (M3 Mock/Service Layer)'
        }


# Alias for backward compatibility
WeatherRiskEngine = WeatherIntelligenceService
