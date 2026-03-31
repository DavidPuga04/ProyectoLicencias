from rest_framework import viewsets
from .models import TramiteLicencia
from .serializers import TramiteSerializer

class TramiteViewSet(viewsets.ModelViewSet):
    """
    Este es el Controlador (C) que maneja la lógica del CRUD.
    Permite crear, leer, actualizar y eliminar trámites.
    """
    queryset = TramiteLicencia.objects.all()
    serializer_class = TramiteSerializer