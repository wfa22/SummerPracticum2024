import requests
from django.core.management.base import BaseCommand
from parser.models import Area


class Command(BaseCommand):
    help = 'Get and store areas from hh.ru'

    def handle(self, *args, **kwargs):
        Area.objects.all().delete()
        url = 'https://api.hh.ru/areas'
        response = requests.get(url, params={'area': 113})
        data = response.json()

        def save_areas(areas):
            for area in areas:
                Area.objects.update_or_create(area_id=area['id'], defaults={'name': area['name']})
                if 'areas' in area:
                    save_areas(area['areas'])

        save_areas(data)
        self.stdout.write(self.style.SUCCESS('Successfully fetched and saved areas'))
