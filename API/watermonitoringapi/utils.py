import requests

def reverse_geocode(lat, lon):
   
    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={"lat": lat, "lon": lon, "format": "json"},
            headers={"User-Agent": "waterpoint-monitor/1.0"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("address", {})

        
        district = (
            data.get("country")
            or data.get("state")
            or data.get("region")
            or data.get("province")
            or "Unknown"
        )

        return {
            "district": district,
            "village": data.get("village") or data.get("town") or data.get("hamlet") or "Unknown",
        }
    except Exception:
        return {"district": "Unknown", "village": "Unknown"}
