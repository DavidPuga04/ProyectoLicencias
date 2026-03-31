from django.db import models

class TramiteLicencia(models.Model):
    cedula_numero = models.CharField(max_length=10, unique=True)
    # Este campo permite subir, editar y eliminar el PDF
    archivo_cedula = models.FileField(upload_to='cedulas/', null=True, blank=True)
    paso_actual = models.IntegerField(default=1) # Para saber en qué paso va
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.cedula_numero