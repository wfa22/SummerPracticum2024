# views.py
from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status
from parser.models import Vacancy, Area
from .serializers import (VacancySerializer,
                          VacancyParseSerializer,
                          AreaSerializer)
from django.core.management import call_command
from django.db.models import Q


class VacancyListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = VacancySerializer

    def get_queryset(self):
        queryset = Vacancy.objects.all()
        search_params = self.request.query_params

        city = search_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)

        keyword = search_params.get('keyword', None)
        if keyword:
            queryset = queryset.filter(
                Q(description__icontains=keyword) |
                Q(title__icontains=keyword)
            )

        salary_from = search_params.get('salary_from', None)
        if salary_from:
            queryset = queryset.filter(salary_from__gte=salary_from)

        salary_to = search_params.get('salary_to', None)
        if salary_to:
            queryset = queryset.filter(salary_to__lte=salary_to)

        employment = search_params.get('employment', None)
        if employment:
            queryset = queryset.filter(employment=employment)

        schedule = search_params.get('schedule', None)
        if schedule:
            queryset = queryset.filter(schedule=schedule)

        experience = search_params.get('experience', None)
        if experience:
            queryset = queryset.filter(experience=experience)

        education = search_params.get('education', None)
        if education:
            queryset = queryset.filter(education=education)

        return queryset


class AreaListAPIView(generics.ListAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class ParseVacanciesAPIView(views.APIView):
    serializer_class = VacancyParseSerializer

    def post(self, request):
        serializer = VacancyParseSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data.get('text')
            area = serializer.validated_data.get('area')
            salary_from = serializer.validated_data.get('salary_from')
            salary_to = serializer.validated_data.get('salary_to')
            employment = serializer.validated_data.get('employment')
            schedule = serializer.validated_data.get('schedule')
            experience = serializer.validated_data.get('experience')
            education = serializer.validated_data.get('education')

            try:
                call_command(
                    'parse_hh',
                    text=text,
                    area=area,
                    salary_from=salary_from,
                    salary_to=salary_to,
                    employment=employment,
                    schedule=schedule,
                    experience=experience,
                    education=education
                )

                if salary_from:
                    Vacancy.objects.filter(salary_from__lt=salary_from).delete()

                return Response({"success": "Parsing started successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
