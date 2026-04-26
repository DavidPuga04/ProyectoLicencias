from rest_framework import viewsets
from rest_framework.permissions import AllowAny 
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TramiteLicencia, Sucursal, AfluenciaHistorica
from .serializers import TramiteSerializer
import math

class TramiteViewSet(viewsets.ModelViewSet):
    queryset = TramiteLicencia.objects.all()
    serializer_class = TramiteSerializer
    permission_classes = [AllowAny] 

    @action(detail=False, methods=['get'])
    def listar_monitoreo(self, request):
        """
        Endpoint para la Figura 1.
        Muestra todas las sedes cargadas en Pichincha para la tabla de React.
        """
        sucursales = Sucursal.objects.all()
        data = []
        for s in sucursales:
            # Buscamos la espera según el script (Lunes=0, Hora=10)
            historico = AfluenciaHistorica.objects.filter(sucursal=s, dia_semana=0, hora=10).first()
            espera = historico.espera_promedio_minutos if historico else 45
            data.append({
                "nombre": s.nombre,
                "espera": f"{espera} min",
                "estado": "BAJA" if espera < 40 else "ALTA"
            })
        return Response(data)

    @action(detail=True, methods=['get'])
    def recomendar_sucursal(self, request, pk=None):
        """
        CORE del proyecto.
        """
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
            distancia = math.sqrt((s.latitud - user_lat)**2 + (s.longitud - user_lon)**2)
            historico = AfluenciaHistorica.objects.filter(
                sucursal=s, dia_semana=dia_actual, hora=hora_actual
            ).first()
            
            espera = historico.espera_promedio_minutos if historico else 45
            tiempo_total = (distancia * 100) + espera

            resultados.append({
                "nombre": s.nombre,
                "espera_en_sede": espera,
                "tiempo_total": tiempo_total
            })

        resultados = sorted(resultados, key=lambda x: x['tiempo_total'])
        mejor_opcion = resultados[0]

        return Response({
            "sucursal": mejor_opcion["nombre"],
            "tiempo_espera": mejor_opcion["espera_en_sede"],
            "ahorro_estimado": 60 - mejor_opcion["espera_en_sede"]
        })