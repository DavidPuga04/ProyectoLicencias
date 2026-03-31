from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from gestion_licencias.views import TramiteViewSet

# Creamos el enrutador automático
router = DefaultRouter()
router.register(r'tramites', TramiteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Esta línea conecta tu lógica de trámites con la URL
    path('api/', include(router.urls)),
]

# Esto permite que los PDFs se puedan ver en el navegador
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)