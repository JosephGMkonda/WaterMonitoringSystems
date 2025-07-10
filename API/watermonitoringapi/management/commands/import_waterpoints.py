import requests
from django.core.management.base import BaseCommand
from watermonitoringapi.models import WaterPoint
from watermonitoringapi.utils import reverse_geocode

class Command(BaseCommand):  
    help = 'Import water points from Overpass API for Malawi'

    def handle(self, *args, **kwargs):
        url = "https://overpass-api.de/api/interpreter?data=[out:json];area[\"name\"=\"Malawi\"]->.a;(node[\"man_made\"=\"water_well\"](area.a);node[\"amenity\"=\"drinking_water\"](area.a););out;"
        print("Fetching water points...")

        response = requests.get(url)

        if response.status_code != 200:
            self.stderr.write("❌ Failed to fetch data from Overpass API")
            return

        data = response.json()
        new_count = 0

        for element in data.get("elements", []):
            lat = element.get("lat")
            lon = element.get("lon")

            if not lat or not lon:
                continue

            
            if WaterPoint.objects.filter(latitude=lat, longitude=lon).exists():
                continue

            location = reverse_geocode(lat, lon)
            name = f"WaterPoint-{element.get('id')}"

            WaterPoint.objects.create(
                name=name,
                latitude=lat,
                longitude=lon,
                village=location.get('village', 'Unknown'),
                district=location.get("district", "Unknown"),  
                status='working' if element.get("tags", {}).get("functioning") == "yes" else 'not_working'
            )

            new_count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Imported {new_count} new water points"))
