# warga/api_urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WargaViewSet, PengaduanViewSet # Impor ViewSet baru

router = DefaultRouter()
router.register(r'warga', WargaViewSet, basename='warga') 

# Daftarkan ViewSet Pengaduan ke router yang sama 
router.register(r'pengaduan', PengaduanViewSet, basename='pengaduan') 

urlpatterns = [
    path('', include(router.urls)),
]