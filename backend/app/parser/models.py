from django.db import models


class Vacancy(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    salary_from = models.IntegerField(null=True, blank=True)
    salary_to = models.IntegerField(null=True, blank=True)
    salary_currency = models.CharField(max_length=10, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(unique=True)
    date_posted = models.DateTimeField()
    skills = models.TextField(blank=True)
    city = models.CharField(max_length=255)
    employment = models.CharField(max_length=50, null=True, blank=True)
    schedule = models.CharField(max_length=50, null=True, blank=True)
    experience = models.CharField(max_length=50, null=True, blank=True)
    education = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.title


class Area(models.Model):
    area_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
