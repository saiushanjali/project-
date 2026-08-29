"""
Customs Compliance & Regulatory Intelligence Engine (Milestone 3)
Validates HS Codes, trade corridor regulatory tariffs, Incoterm responsibility,
detects missing mandatory export/import documentation, computes customs readiness score,
and tracks document upload status.
"""
from typing import Dict, Any, List
import re

COMMON_HS_CODES = {
    '8471': {'category': 'Computers & Data Processing Machinery', 'base_tariff_pct': 0.0, 'restricted': False},
    '8703': {'category': 'Motor Vehicles & Passenger Cars', 'base_tariff_pct': 25.0, 'restricted': False},
    '3004': {'category': 'Pharmaceutical Products & Medicaments', 'base_tariff_pct': 3.5, 'restricted': True},
    '8517': {'category': 'Telecommunication & Smartphone Equipment', 'base_tariff_pct': 7.5, 'restricted': False},
    '2902': {'category': 'Organic Chemicals & Industrial Solvents', 'base_tariff_pct': 10.0, 'restricted': True},
    '0901': {'category': 'Coffee, Tea, & Agricultural Produce', 'base_tariff_pct': 15.0, 'restricted': False},
}


class CustomsComplianceEngine:
    @staticmethod
    def validate_hs_code(hs_code: str) -> Dict[str, Any]:
        cleaned = re.sub(r'[^0-9]', '', str(hs_code or ''))
        if len(cleaned) < 4:
            return {
                'hs_code': hs_code or 'NOT_PROVIDED',
                'is_valid': False,
                'category': 'Unclassified / General Commercial Cargo',
                'base_tariff_pct': 5.0,
                'issue': 'Missing or short 4-digit HS Code format.'
            }
        
        prefix = cleaned[:4]
        info = COMMON_HS_CODES.get(prefix, {'category': 'General Manufactured Goods', 'base_tariff_pct': 6.5, 'restricted': False})
        return {
            'hs_code': hs_code,
            'is_valid': True,
            'category': info['category'],
            'base_tariff_pct': info['base_tariff_pct'],
            'is_restricted': info.get('restricted', False),
            'issue': None
        }

    @staticmethod
    def evaluate_compliance(
        origin_code: str,
        dest_code: str,
        hs_code: str = '8471.30.00',
        commodity: str = 'Commercial Export Goods',
        transport_mode: str = 'OCEAN',
        cargo_type: str = 'STANDARD',
        incoterm: str = 'FOB',
        declared_value: float = 0.0,
        is_hazardous: bool = False,
        is_reefer: bool = False,
        uploaded_doc_codes: List[str] = None
    ) -> Dict[str, Any]:
        origin_u = (origin_code or 'INMAA').strip().upper()
        dest_u = (dest_code or 'INNSA').strip().upper()
        cargo_u = (cargo_type or 'STANDARD').strip().upper()
        incoterm_u = (incoterm or 'FOB').strip().upper()
        uploaded_set = set(uploaded_doc_codes or ['BOL', 'INV'])

        hs_info = CustomsComplianceEngine.validate_hs_code(hs_code)
        
        missing_alerts: List[str] = []
        doc_checklist: List[Dict[str, Any]] = [
            {"code": "BOL", "name": "Bill of Lading / Air Waybill", "required": True, "status": "UPLOADED" if "BOL" in uploaded_set else "MISSING"},
            {"code": "INV", "name": "Commercial Invoice & Detailed Packing List", "required": True, "status": "UPLOADED" if "INV" in uploaded_set else "MISSING"},
            {"code": "COO", "name": "Certificate of Origin (Preferential Trade Agreement)", "required": True, "status": "UPLOADED" if "COO" in uploaded_set else "MISSING"},
        ]

        # 1. HS Code Check
        if not hs_info['is_valid']:
            missing_alerts.append("Missing mandatory 6-digit Harmonized System (HS) Code for customs declaration.")

        # 2. Hazardous Cargo Check
        if is_hazardous or cargo_u == 'HAZARDOUS' or hs_info.get('is_restricted'):
            doc_checklist.append({"code": "DGD", "name": "Dangerous Goods Declaration (IMDG Code)", "required": True, "status": "UPLOADED" if "DGD" in uploaded_set else "MISSING"})
            doc_checklist.append({"code": "MSDS", "name": "Material Safety Data Sheet (MSDS)", "required": True, "status": "UPLOADED" if "MSDS" in uploaded_set else "MISSING"})
            if "DGD" not in uploaded_set:
                missing_alerts.append("Dangerous Goods Declaration (DGD) required for IMDG Hazmat classification.")

        # 3. Perishable Cargo Check
        if is_reefer or cargo_u == 'PERISHABLE':
            doc_checklist.append({"code": "PHYTO", "name": "Phytosanitary & Plant Quarantine Certificate", "required": True, "status": "UPLOADED" if "PHYTO" in uploaded_set else "MISSING"})
            if "PHYTO" not in uploaded_set:
                missing_alerts.append("Phytosanitary certificate mandatory for perishable agricultural cargo.")

        # 4. DDP Incoterm Import Check
        if incoterm_u == 'DDP':
            doc_checklist.append({"code": "BOE_IMP", "name": "Import Bill of Entry & Destination Duty Receipt", "required": True, "status": "UPLOADED" if "BOE_IMP" in uploaded_set else "MISSING"})

        # 5. ICEGATE India Export Filing Check
        if 'IN' in origin_u:
            doc_checklist.append({"code": "ICEGATE", "name": "ICEGATE Shipping Bill EDIF Filing", "required": True, "status": "UPLOADED" if "ICEGATE" in uploaded_set or "BOL" in uploaded_set else "MISSING"})

        # Calculate Customs Readiness / Compliance Score (100% max)
        required_items = [item for item in doc_checklist if item['required']]
        uploaded_items = [item for item in required_items if item['status'] == 'UPLOADED']
        
        doc_completion_pct = (len(uploaded_items) / len(required_items)) * 100.0 if required_items else 100.0
        
        readiness_score = round(doc_completion_pct, 1)
        if not hs_info['is_valid']:
            readiness_score = max(10.0, readiness_score - 20.0)

        hold_prob_pct = round(max(5.0, 100.0 - readiness_score * 0.9), 1)

        if readiness_score >= 85:
            status_tier = "READY_FOR_CLEARANCE"
        elif readiness_score >= 50:
            status_tier = "ACTION_REQUIRED"
        else:
            status_tier = "BLOCKED"

        return {
            'customs_readiness_score': readiness_score,
            'customs_hold_probability_pct': hold_prob_pct,
            'readiness_status': status_tier,
            'hs_code_analysis': hs_info,
            'incoterm': incoterm_u,
            'estimated_duty_rate_pct': hs_info['base_tariff_pct'],
            'document_checklist': doc_checklist,
            'missing_information_alerts': missing_alerts if missing_alerts else ["All mandatory customs details & paperwork present."],
            'is_customs_ready': len(missing_alerts) == 0 and readiness_score >= 85
        }
