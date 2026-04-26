from rest_framework import serializers
from .models import TramiteLicencia

class TramiteSerializer(serializers.ModelSerializer):
    # Definimos los campos como opcionales para que no den error 400 al empezar
    archivo_cedula = serializers.FileField(required=False, allow_null=True)
    archivo_sangre = serializers.FileField(required=False, allow_null=True)
    archivo_psico = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = TramiteLicencia
        fields = '__all__'