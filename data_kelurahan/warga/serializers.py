from rest_framework import serializers
from .models import Warga, Pengaduan

class WargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warga
        fields = ['id', 'nama_lengkap', 'alamat', 'nik']

class PengaduanSerializer(serializers.ModelSerializer):
    class Meta:
        # Gunakan nama model yang benSar di sini
        model = Pengaduan
        # Sesuaikan fields sesuai model Anda
        fields = ['id', 'judul', 'deskripsi', 'tanggal_lapor', 'status']