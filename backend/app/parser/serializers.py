# parser/serializers.py

from rest_framework import serializers
from .models import Vacancy, Area


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['area_id', 'name']


class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = '__all__'


class VacancyParseSerializer(serializers.Serializer):
    text = serializers.CharField(required=False, allow_blank=True)
    area = serializers.IntegerField(required=False)
    salary_from = serializers.IntegerField(required=False, allow_null=True)
    salary_to = serializers.IntegerField(required=False, allow_null=True)

    EMPLOYMENT_CHOICES = [
        ('full', 'Полная занятость'),
        ('part', 'Частичная занятость'),
        ('project', 'Проектная работа/разовое задание'),
        ('volunteer', 'Волонтерство'),
        ('probation', 'Стажировка')
    ]
    SCHEDULE_CHOICES = [
        ('fullDay', 'Полный день'),
        ('shift', 'Сменный график'),
        ('flexible', 'Гибкий график'),
        ('remote', 'Удаленная работа'),
        ('flyInFlyOut', 'Вахтовый метод')
    ]
    EXPERIENCE_CHOICES = [
        ('noExperience', 'Нет опыта'),
        ('between1And3', 'От 1 года до 3 лет'),
        ('between3And6', 'От 3 до 6 лет'),
        ('moreThan6', 'Более 6 лет')
    ]
    EDUCATION_CHOICES = [
        ('special_secondary', 'Среднее специальное'),
        ('higher', 'Высшее'),
    ]

    employment = serializers.ChoiceField(choices=EMPLOYMENT_CHOICES,
                                         required=False,
                                         allow_null=True,
                                         allow_blank=True)
    schedule = serializers.ChoiceField(choices=SCHEDULE_CHOICES,
                                       required=False,
                                       allow_null=True,
                                       allow_blank=True)
    experience = serializers.ChoiceField(choices=EXPERIENCE_CHOICES,
                                         required=False,
                                         allow_null=True,
                                         allow_blank=True)
    education = serializers.ChoiceField(choices=EDUCATION_CHOICES,
                                        required=False,
                                        allow_null=True,
                                        allow_blank=True)

    def create(self, validated_data):
        return Vacancy.objects.create(**validated_data)
