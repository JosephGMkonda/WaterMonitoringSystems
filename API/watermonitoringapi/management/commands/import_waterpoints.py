from django.core.management.base import BaseCommand
import requests
import time
from watermonitoringapi.models import WaterPoint
from watermonitoringapi.utils import reverse_geocode


class Command(BaseCommand):
    help = "Import water points in Malawi from OpenStreetMap (Overpass API) and reverse geocode"

    def add_arguments(self, parser):
        parser.add_argument(
            "--debug",
            action="store_true",
            help="Print raw geocoding results for debugging"
        )

    def handle(self, *args, **kwargs):
        debug = kwargs.get("debug", False)
        self.stdout.write("🚿 Importing water points...")

        # Step 1: Clear old water points
        self.stdout.write("🧹 Clearing old water points...")
        deleted, _ = WaterPoint.objects.all().delete()
        self.stdout.write(f"✅ Deleted {deleted} old records")

        # Step 2: Fetch fresh data from Overpass API
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

        # Step 3: Save new data
        imported_count = 0
        for element in data.get("elements", []):
            lat = element.get("lat")
            lon = element.get("lon")
            tags = element.get("tags", {})

            if not lat or not lon:
                continue

            name = tags.get("name") or tags.get("description") or f"WaterPoint-{element.get('id')}"

            # Use util for reverse geocoding
            geo = reverse_geocode(lat, lon)

            if debug:
                self.stdout.write(f"\n📍 DEBUG for {name} ({lat},{lon}):")
                # Instead of just printing, call nominatim again to get full response
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
                    self.stdout.write(str(r.json().get("address", {})))
                except Exception as e:
                    self.stderr.write(f"⚠️ Debug fetch failed: {e}")

            # Avoid hitting API rate limits
            time.sleep(1)

            WaterPoint.objects.create(
                name=name,
                latitude=lat,
                longitude=lon,
                village=geo["village"],
                district=geo["district"],
                status="working",
                raw_address=geo["raw_address"]
            )

            imported_count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Imported {imported_count} new water points"))
