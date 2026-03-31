from rest_framework import serializers
from .models import TramiteLicencia

class TramiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TramiteLicencia
        fields = '__all__'