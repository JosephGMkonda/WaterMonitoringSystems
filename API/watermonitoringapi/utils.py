import requests

def reverse_geocode(lat, lon):
    try:
        r = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={
                "lat": lat,
                "lon": lon,
                "format": "json",
                "addressdetails": 1
            },
            headers={"User-Agent": "WaterMonitoringApp/1.0"},
            timeout=10,
        )
        data = r.json()
        address = data.get("address", {})

        district = (
            address.get("county")
            or address.get("district")
            or address.get("municipality")
            or address.get("city")
            or address.get("region")
            or address.get("state_district")
            or "Unknown"
        )

        village = (
            address.get("village")
            or address.get("hamlet")
            or address.get("suburb")
            or address.get("town")
            or address.get("locality")
            or "Unknown"
        )

        return {"district": district, "village": village, "raw_address": address}

    except Exception:
        return {"district": "Unknown", "village": "Unknown", "raw_address": {}}
