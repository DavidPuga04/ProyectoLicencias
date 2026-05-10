from django.apps import AppConfig
from django.contrib.auth.models import User

class GestionLicenciasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gestion_licencias'

    def ready(self):
        try:
            if not User.objects.filter(username="admin").exists():
                User.objects.create_superuser(
                    username="admin",
                    password="admin123"
                )
        except Exception:
            pass