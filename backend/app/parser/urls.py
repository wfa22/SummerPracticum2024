# urls.py
from django.urls import path
from drf_spectacular.views import (SpectacularAPIView,
                                   SpectacularSwaggerView)
from .views import (VacancyListCreateAPIView,
                    ParseVacanciesAPIView,
                    AreaListAPIView,)

urlpatterns = [
    path('vacancies/',
         VacancyListCreateAPIView.as_view(),
         name='vacancy-list-create'),
    path('parse/',
         ParseVacanciesAPIView.as_view(),
         name='parse-vacancies'),
    path('areas/',
         AreaListAPIView.as_view(),
         name='area-list'),
    path('schema/',
         SpectacularAPIView.as_view(),
         name='schema'),
    path('docs/',
         SpectacularSwaggerView.as_view(url_name='schema'),
         name='swagger-ui'),
]
