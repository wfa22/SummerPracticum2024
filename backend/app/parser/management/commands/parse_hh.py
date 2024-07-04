import requests
from django.core.management.base import BaseCommand
from parser.models import Vacancy
from datetime import datetime

class Command(BaseCommand):
    help = 'Parse vacancies from hh.ru using API'

    def add_arguments(self, parser):
        parser.add_argument('--text',
                            type=str,
                            help='Text to search in vacancy names and descriptions')
        parser.add_argument('--area',
                            type=str,
                            help='Region ID (e.g., 1 for Moscow)')
        parser.add_argument('--salary_from',
                            type=int,
                            help='Minimum salary')
        parser.add_argument('--salary_to',
                            type=int,
                            help='Maximum salary')
        parser.add_argument('--employment',
                            type=str,
                            help='Type of employment')
        parser.add_argument('--schedule',
                            type=str,
                            help='Work schedule')
        parser.add_argument('--experience',
                            type=str,
                            help='Required work experience')
        parser.add_argument('--education',
                            type=str,
                            help='Required education')

    def handle(self, *args, **options):
        text = options['text']
        area = options['area']
        salary_from = options['salary_from']
        salary_to = options['salary_to']
        employment = options['employment']
        schedule = options['schedule']
        experience = options['experience']
        education = options['education']

        params = {
            'text': text,
            'area': area,
            'salary_from': salary_from,
            'salary_to': salary_to,
            'employment': employment if employment else None,
            'schedule': schedule if schedule else None,
            'experience': experience if experience else None,
            'education': education if education else None,
            'page': 0,
            'per_page': 100,
        }

        params = {k: v for k, v in params.items() if v is not None}

        base_url = 'https://api.hh.ru/vacancies'

        while True:
            response = requests.get(base_url, params=params)
            print("Request Params:", params)
            print("Status Code:", response.status_code)

            if response.status_code != 200 or not response.text.strip():
                self.stderr.write(
                    self.style.ERROR(f"Error: Received non-200 response or empty response: {response.text}"))
                break

            try:
                data = response.json()
            except ValueError as e:
                self.stderr.write(self.style.ERROR(f"Error parsing JSON response: {e}"))
                self.stderr.write(self.style.ERROR(f"Response text: {response.text}"))
                break

            print(f"Total pages: {data['pages']}, Total found: {data['found']}")

            for item in data.get('items', []):
                title = item['name']
                company = item['employer']['name']
                salary = item.get('salary', {})
                salary_min = salary.get('from') if salary else None
                salary_max = salary.get('to') if salary else None
                salary_currency = salary.get('currency') if salary else None
                description = item['snippet']['responsibility'] if item['snippet'] and item['snippet'].get('responsibility') else ""
                url = item['alternate_url']
                date_posted = datetime.strptime(item['published_at'], '%Y-%m-%dT%H:%M:%S%z')
                skills = ', '.join([skill['name'] for skill in item.get('key_skills', [])]) if item.get('key_skills') else ""
                city = item['area']['name'] if item.get('area') else ""

                employment_type = item.get('employment', {}).get('id')
                schedule_type = item.get('schedule', {}).get('id')
                experience_type = item.get('experience', {}).get('id')

                vacancy, created = Vacancy.objects.update_or_create(
                    url=url,
                    defaults={
                        'title': title,
                        'company': company,
                        'salary_from': salary_min,
                        'salary_to': salary_max,
                        'salary_currency': salary_currency,
                        'description': description,
                        'date_posted': date_posted,
                        'skills': skills,
                        'city': city,
                        'employment': employment_type,
                        'schedule': schedule_type,
                        'experience': experience_type,
                        'education': education
                    }
                )

            if params['page'] >= data['pages'] - 1:
                break
            params['page'] += 1
            print(f"Moving to page {params['page']}")

            self.stdout.write(self.style.SUCCESS(f'Parsed page {params["page"]}'))

        self.stdout.write(self.style.SUCCESS('Successfully parsed and saved vacancies from hh.ru API'))