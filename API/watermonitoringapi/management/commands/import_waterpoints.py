from django.core.management.base import BaseCommand
import requests
from watermonitoringapi.models import WaterPoint
import time

class Command(BaseCommand):
    help = "Import water points in Malawi from OpenStreetMap (Overpass API) and reverse geocode"

    def handle(self, *args, **kwargs):
        self.stdout.write("Fetching water points...")

        url = """
        https://overpass-api.de/api/interpreter?data=[out:json][timeout:180];
        area["name"="Malawi"]->.a;
        (
          node["man_made"="water_well"](area.a);
          node["amenity"="drinking_water"](area.a);
          node["man_made"="water_tap"](area.a);
          node["man_made"="water_tank"](area.a);
          node["man_made"="water_tower"](area.a);
          node["man_made"="water_pump"](area.a);
          node["amenity"="fountain"](area.a);
          node["man_made"="reservoir"](area.a);
        );
        out center;
        """

        response = requests.get(url.strip())
        if response.status_code != 200:
            self.stderr.write(f"❌ Failed to fetch data. Status: {response.status_code}")
            return

        try:
            data = response.json()
        except ValueError:
            self.stderr.write("❌ Response is not valid JSON")
            return

        imported_count = 0
        for element in data.get("elements", []):
            lat = element.get("lat")
            lon = element.get("lon")
            tags = element.get("tags", {})

            if not lat or not lon:
                continue

            if WaterPoint.objects.filter(latitude=lat, longitude=lon).exists():
                continue

            name = tags.get("name") or tags.get("description") or f"WaterPoint-{element.get('id')}"

            # Reverse geocode using Nominatim
            district = "Unknown"
            village = "Unknown"
            try:
                r = requests.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    params={
                        "format": "json",
                        "lat": lat,
                        "lon": lon,
                        "zoom": 16,
                        "addressdetails": 1
                    },
                    headers={"User-Agent": "WaterMonitoringApp/1.0"}
                )
                r_json = r.json()
                address = r_json.get("address", {})
                village = address.get("village") or address.get("town") or address.get("suburb") or "Unknown"
                district = address.get("county") or address.get("state_district") or "Unknown"

                # Avoid hitting rate limits
                time.sleep(1)
            except Exception as e:
                self.stderr.write(f"⚠️ Reverse geocoding failed for {lat},{lon}: {e}")

            WaterPoint.objects.create(
                name=name,
                latitude=lat,
                longitude=lon,
                village=village,
                district=district,
                status='working'  # Default status
            )

            imported_count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Imported {imported_count} new water points"))
