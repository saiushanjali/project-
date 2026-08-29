"""
Risk Alerts & Intelligence Notification Service (Milestone 3)
Generates, stores, and manages real-time risk notifications for severe weather advisories,
customs compliance holds, high composite shipment risk scores, and pricing variances.
"""
from typing import List, Dict, Any
from datetime import datetime

SYSTEM_ALERTS: List[Dict[str, Any]] = [
    {
        "id": "ALT-2026-101",
        "title": "Severe Weather Swell Warning",
        "alert_type": "WEATHER_RISK",
        "severity": "HIGH",
        "message": "South-West Monsoon swell active along Chennai (INMAA) → Shanghai (CNSHA) maritime corridor. Est. transit delay buffer: +3.5 days.",
        "timestamp": "2026-08-29T14:15:00Z",
        "status": "UNACKNOWLEDGED",
        "acknowledged": False,
        "action_link": "/dashboard/new-shipment"
    },
    {
        "id": "ALT-2026-102",
        "title": "Customs Compliance Hold Risk",
        "alert_type": "CUSTOMS_RISK",
        "severity": "CRITICAL",
        "message": "Dangerous Goods Declaration (DGD) and Certificate of Origin missing for shipment INNSA → USLAX. Action required prior to port entry.",
        "timestamp": "2026-08-29T13:45:00Z",
        "status": "UNACKNOWLEDGED",
        "acknowledged": False,
        "action_link": "/dashboard/quotations"
    },
    {
        "id": "ALT-2026-103",
        "title": "High Composite Shipment Risk",
        "alert_type": "SHIPMENT_RISK",
        "severity": "HIGH",
        "message": "Shipment QT-2026-9820 evaluated with Composite Risk Score 53.5/100 (HIGH). Manager approval required before carrier booking.",
        "timestamp": "2026-08-29T12:30:00Z",
        "status": "UNACKNOWLEDGED",
        "acknowledged": False,
        "action_link": "/dashboard/quotations"
    },
    {
        "id": "ALT-2026-104",
        "title": "Nhava Sheva Port Congestion Notice",
        "alert_type": "SHIPMENT_RISK",
        "severity": "MEDIUM",
        "message": "Port of Nhava Sheva (JNPT) experiencing 48hr berth congestion delay due to container terminal crane maintenance.",
        "timestamp": "2026-08-29T11:10:00Z",
        "status": "UNACKNOWLEDGED",
        "acknowledged": False,
        "action_link": "/dashboard"
    },
    {
        "id": "ALT-2026-105",
        "title": "Bunker Fuel Surcharge Spike",
        "alert_type": "ML_PRICE",
        "severity": "MEDIUM",
        "message": "Fuel price index increased by +4.2%. ML rate predictor auto-adjusting ocean freight spot rate forecasts.",
        "timestamp": "2026-08-29T09:15:00Z",
        "status": "ACKNOWLEDGED",
        "acknowledged": True,
        "action_link": "/dashboard/master-data"
    },
    {
        "id": "ALT-2026-106",
        "title": "ML Price Prediction Variance",
        "alert_type": "ML_PRICE",
        "severity": "INFO",
        "message": "GradientBoosting ML model predicted ₹2,31,500 vs rule-based cost ₹2,37,360 (-2.47% variance corridor).",
        "timestamp": "2026-08-29T10:00:00Z",
        "status": "ACKNOWLEDGED",
        "acknowledged": True,
        "action_link": "/dashboard/master-data"
    }
]


class AlertService:
    @staticmethod
    def get_user_alerts(user=None) -> List[Dict[str, Any]]:
        return list(SYSTEM_ALERTS)

    @staticmethod
    def acknowledge_alert(alert_id: str) -> bool:
        for alt in SYSTEM_ALERTS:
            if alt['id'] == alert_id or str(alt['id']).endswith(str(alert_id)):
                alt['acknowledged'] = True
                alt['status'] = "ACKNOWLEDGED"
                alt['read'] = True
                return True
        return False

    @staticmethod
    def create_alert(title: str, alert_type: str, severity: str, message: str, action_link: str = "/dashboard") -> Dict[str, Any]:
        new_id = f"ALT-2026-{len(SYSTEM_ALERTS) + 101}"
        alert_obj = {
            "id": new_id,
            "title": title,
            "alert_type": alert_type,
            "severity": severity.upper(),
            "message": message,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "UNACKNOWLEDGED",
            "acknowledged": False,
            "action_link": action_link
        }
        SYSTEM_ALERTS.insert(0, alert_obj)
        return alert_obj

