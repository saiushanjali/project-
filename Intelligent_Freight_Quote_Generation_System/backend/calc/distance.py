import math
from typing import Dict, Optional, Tuple

DETOUR_FACTOR = {
    'IN': 1.30,
    'AE': 1.20,
    'EU': 1.25,
    'US': 1.22,
    'DEFAULT': 1.30
}

# Seeded ocean distances (nautical miles) between major global trade hubs
# Source: Published marine distance tables (via Suez, Panama, Malacca corridors)
PORT_DISTANCES_TABLE: Dict[Tuple[str, str], float] = {
    ('INNSA', 'AEJEA'): 1080.0,
    ('AEJEA', 'INNSA'): 1080.0,
    ('INNSA', 'NLRTM'): 6350.0,
    ('NLRTM', 'INNSA'): 6350.0,
    ('INNSA', 'DEHAM'): 6650.0,
    ('DEHAM', 'INNSA'): 6650.0,
    ('INNSA', 'SGSIN'): 2250.0,
    ('SGSIN', 'INNSA'): 2250.0,
    ('INNSA', 'USNYC'): 8150.0,
    ('USNYC', 'INNSA'): 8150.0,
    ('INNSA', 'USLAX'): 10800.0,
    ('USLAX', 'INNSA'): 10800.0,
    ('INNSA', 'CNSHA'): 4520.0,
    ('CNSHA', 'INNSA'): 4520.0,
    ('CNSHA', 'USLAX'): 5700.0,
    ('USLAX', 'CNSHA'): 5700.0,
    ('CNSHA', 'NLRTM'): 10500.0,
    ('NLRTM', 'CNSHA'): 10500.0,
    ('CNSHA', 'DEHAM'): 10800.0,
    ('DEHAM', 'CNSHA'): 10800.0,
    ('CNSHA', 'SGSIN'): 2250.0,
    ('SGSIN', 'CNSHA'): 2250.0,
    ('SGSIN', 'NLRTM'): 8280.0,
    ('NLRTM', 'SGSIN'): 8280.0,
    ('SGSIN', 'DEHAM'): 8580.0,
    ('DEHAM', 'SGSIN'): 8580.0,
    ('SGSIN', 'AEJEA'): 3150.0,
    ('AEJEA', 'SGSIN'): 3150.0,
    ('AEJEA', 'NLRTM'): 5280.0,
    ('NLRTM', 'AEJEA'): 5280.0,
    ('AEJEA', 'DEHAM'): 5580.0,
    ('DEHAM', 'AEJEA'): 5580.0,
    ('AEJEA', 'USNYC'): 7080.0,
    ('USNYC', 'AEJEA'): 7080.0,
    ('USLAX', 'AEJEA'): 11900.0,
    ('AEJEA', 'USLAX'): 11900.0,
    ('NLRTM', 'USNYC'): 3200.0,
    ('USNYC', 'NLRTM'): 3200.0,
    ('DEHAM', 'USNYC'): 3450.0,
    ('USNYC', 'DEHAM'): 3450.0,
    ('INMAA', 'SGSIN'): 1580.0,
    ('SGSIN', 'INMAA'): 1580.0,
    ('INMAA', 'AEJEA'): 1950.0,
    ('AEJEA', 'INMAA'): 1950.0,
    ('INMAA', 'INNSA'): 1120.0,
    ('INNSA', 'INMAA'): 1120.0,
    ('INMAA', 'INMUN'): 1450.0,
    ('INMUN', 'INMAA'): 1450.0,
    ('INMAA', 'INCCU'): 750.0,
    ('INCCU', 'INMAA'): 750.0,
    ('INMAA', 'INCOK'): 580.0,
    ('INCOK', 'INMAA'): 580.0,
    ('INNSA', 'INMUN'): 480.0,
    ('INMUN', 'INNSA'): 480.0,
    ('INNSA', 'INCCU'): 1650.0,
    ('INCCU', 'INNSA'): 1650.0,
    ('INNSA', 'INCOK'): 780.0,
    ('INCOK', 'INNSA'): 780.0,
    ('INCCU', 'SGSIN'): 1680.0,
    ('SGSIN', 'INCCU'): 1680.0,
    ('INCOK', 'SGSIN'): 1820.0,
    ('SGSIN', 'INCOK'): 1820.0,
    ('INMUN', 'SGSIN'): 2650.0,
    ('SGSIN', 'INMUN'): 2650.0,
    ('INVTZ', 'SGSIN'): 1420.0,
    ('SGSIN', 'INVTZ'): 1420.0,
    ('INTUT', 'SGSIN'): 1650.0,
    ('SGSIN', 'INTUT'): 1650.0,
    ('INMRM', 'AEJEA'): 1150.0,
    ('AEJEA', 'INMRM'): 1150.0,
    ('INBLR', 'SGSIN'): 1780.0,
    ('SGSIN', 'INBLR'): 1780.0,
    ('INTKD', 'SGSIN'): 2850.0,
    ('SGSIN', 'INTKD'): 2850.0,
    ('INHYD', 'SGSIN'): 2150.0,
    ('SGSIN', 'INHYD'): 2150.0,
    ('INMUN', 'AEJEA'): 920.0,
    ('AEJEA', 'INMUN'): 920.0,
    ('INMUN', 'NLRTM'): 6200.0,
    ('NLRTM', 'INMUN'): 6200.0,
    ('CNSHK', 'USLAX'): 6400.0,
    ('USLAX', 'CNSHK'): 6400.0,
    ('HKHKG', 'USLAX'): 6500.0,
    ('USLAX', 'HKHKG'): 6500.0,
    ('KRPUS', 'USLAX'): 5100.0,
    ('USLAX', 'KRPUS'): 5100.0,
    ('JPYOK', 'USLAX'): 4840.0,
    ('USLAX', 'JPYOK'): 4840.0,
}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance in kilometers between two coordinates."""
    r = 6371.0  # Earth's radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)


def road_distance(lat1: float, lon1: float, lat2: float, lon2: float, country: str = 'DEFAULT') -> float:
    """Estimates road kilometers using Haversine multiplied by the regional detour factor."""
    base_km = haversine_distance(lat1, lon1, lat2, lon2)
    factor = DETOUR_FACTOR.get(country.upper(), DETOUR_FACTOR['DEFAULT'])
    return round(base_km * factor, 2)


def sea_distance(origin_code: str, dest_code: str, table: Optional[Dict[Tuple[str, str], float]] = None) -> Optional[float]:
    """
    Looks up nautical miles from the seeded port distances table.
    Ocean distance NEVER uses naive Haversine because straight lines cut across land.
    """
    dist_table = table or PORT_DISTANCES_TABLE
    key = (origin_code.strip().upper(), dest_code.strip().upper())
    if key in dist_table:
        return dist_table[key]

    # Return None if lane is unserviced
    return None


def main_leg_distance(
    origin_lat: float, origin_lon: float, origin_code: str,
    dest_lat: float, dest_lon: float, dest_code: str,
    mode: str,
    table: Optional[Dict[Tuple[str, str], float]] = None
) -> Tuple[float, str]:
    """
    Returns (distance_value, unit) for the main leg according to the transport mode.
    Modes:
      OCEAN -> nautical miles from sea_distance lookup
      AIR / EXPRESS_AIR -> haversine * 1.06 (airway routing overhead) in km
      GROUND_RAIL -> haversine * 1.30 (road/rail corridor factor) in km
    """
    m = mode.upper()
    if m == 'OCEAN':
        dist_nm = sea_distance(origin_code, dest_code, table)
        if dist_nm is None:
            from core.exceptions import LaneUnservicedException
            raise LaneUnservicedException(f"Lane Not Serviced: Ocean maritime corridor from {origin_code} to {dest_code} is unavailable.")
        return dist_nm, 'NM'
    elif m in ('AIR', 'EXPRESS_AIR'):
        great_circle_km = haversine_distance(origin_lat, origin_lon, dest_lat, dest_lon)
        air_km = round(great_circle_km * 1.06, 2)
        return air_km, 'KM'
    else:  # GROUND_RAIL
        great_circle_km = haversine_distance(origin_lat, origin_lon, dest_lat, dest_lon)
        road_km = round(great_circle_km * 1.30, 2)
        return road_km, 'KM'
