from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import TramiteLicencia, Sucursal, AfluenciaHistorica, Zona
from .serializers import TramiteSerializer, ZonaSerializer

import math


class TramiteViewSet(viewsets.ModelViewSet):

    queryset = TramiteLicencia.objects.all()
    serializer_class = TramiteSerializer
    permission_classes = [AllowAny]

    
    # VALIDACIÓN DE CÉDULA 
   
    @action(detail=False, methods=['post'])
    def validar_cedula(self, request):

        cedula = request.data.get("cedula_numero")

        if not cedula:
            return Response(
                {"error": "Cédula requerida"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # reutiliza serializer 
        serializer = TramiteSerializer(data={"cedula_numero": cedula})

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # si pasa validación
        return Response(
            {"message": "Cédula válida"},
            status=status.HTTP_200_OK
        )

    
    # MONITOREO
    
    @action(detail=False, methods=['get'])
    def listar_monitoreo(self, request):

        sucursales = Sucursal.objects.all()
        data = []

        for s in sucursales:

            historico = AfluenciaHistorica.objects.filter(
                sucursal=s,
                dia_semana=0,
                hora=10
            ).first()

            espera = historico.espera_promedio_minutos if historico else 45

            data.append({
                "nombre": s.nombre,
                "espera": f"{espera} min",
                "estado": "BAJA" if espera < 40 else "ALTA"
            })

        return Response(data)

    
    # RECOMENDACIÓN
    
    @action(detail=True, methods=['get'])
    def recomendar_sucursal(self, request, pk=None):

        user_lat = float(request.query_params.get('lat', -0.1807))
        user_lon = float(request.query_params.get('lon', -78.4678))
        dia_actual = int(request.query_params.get('dia', 0))
        hora_actual = int(request.query_params.get('hora', 10))

        sucursales = Sucursal.objects.all()

        if not sucursales.exists():
            return Response({
                "sucursal": "Sin sedes disponibles",
                "tiempo_espera": 0,
                "ahorro_estimado": 0
            })

        resultados = []

        for s in sucursales:

            distancia = math.sqrt(
                (s.latitud - user_lat)**2 +
                (s.longitud - user_lon)**2
            )

            historico = AfluenciaHistorica.objects.filter(
                sucursal=s,
                dia_semana=dia_actual,
                hora=hora_actual
            ).first()

            espera = historico.espera_promedio_minutos if historico else 45

            tiempo_total = (distancia * 100) + espera

            resultados.append({
                "nombre": s.nombre,
                "espera_en_sede": espera,
                "tiempo_total": tiempo_total
            })

        resultados = sorted(
            resultados,
            key=lambda x: x['tiempo_total']
        )

        mejor_opcion = resultados[0]

        return Response({
            "sucursal": mejor_opcion["nombre"],
            "tiempo_espera": mejor_opcion["espera_en_sede"],
            "ahorro_estimado": 60 - mejor_opcion["espera_en_sede"]
        })


class ZonaViewSet(viewsets.ModelViewSet):

    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer
    permission_classes = [AllowAny]