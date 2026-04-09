# Sistema de Gestión de Licencias ANT (ProyectoLicencias)

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-green)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Django](https://img.shields.io/badge/Django-6.0-green)
![React](https://img.shields.io/badge/React-18-blue)

## Descripción del Proyecto
Este es un sistema web diseñado para la gestión y digitalización de trámites de licencias de conducir. El objetivo principal es optimizar el proceso de validación de documentos mediante una arquitectura moderna, segura y escalable.

El proyecto implementa un flujo de usuario dividido en pasos (Stepper) y una sección protegida mediante autenticación robusta.

---

## Funcionalidades Clave
* **Autenticación Segura:** Sistema de Login basado en **JWT (JSON Web Tokens)**.
* **Secciones Protegidas:** Solo usuarios autenticados pueden acceder al proceso de gestión.
* **CRUD de Documentos:** Carga y validación de archivos PDF (Cédulas).
* **Arquitectura MVC:** Separación clara entre la lógica de negocio (Backend) y la interfaz de usuario (Frontend).

---

## Tecnologías Utilizadas

### Backend (Cerebro)
* **Python & Django:** Framework principal.
* **Django REST Framework:** Para la creación de la API.
* **Simple JWT:** Gestión de tokens de seguridad.
* **SQLite (Por el momento):** Base de datos relacional (Entorno de desarrollo).

### Frontend (Interfaz)
* **React.js:** Biblioteca para interfaces de usuario dinámicas.
* **JavaScript (ES6+):** Lógica del lado del cliente.
* **CSS3:** Estilizado de componentes.

---

## Configuración e Instalación

### Requisitos Previos
* Python 3.10 o superior.
* Node.js y npm instalados.

### 1. Clonar o descargar el repositorio
```bash
https://github.com/DavidPuga04/ProyectoLicencias.git
```

---

### 2. Configurar el Backend
Abre una terminal y coloca los siguientes comandos en orden:

* #### Crear y activar entorno virtual
```bash
python -m venv venv
.\venv\Scripts\activate
```

* #### Instalar dependencias
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
```

* #### Realizar migraciones
```bash
python manage.py migrate
```

* #### Iniciar servidor
```bash
python manage.py runserver
```

---

### 3. Configurar el Frontend
Abre una nueva terminal y coloca los siguientes comandos:
```bash
cd frontend
npm install
npm start
```

---

## Resultado esperado
<img width="469" height="285" alt="1" src="https://github.com/user-attachments/assets/7f9fb743-06fc-4f91-95df-9154c6fd8c82" />

---

## 👤 Autor
David Puga - Estudiante de Ingeniería en Software - https://github.com/DavidPuga04

--- 

## 📄 Licencia
Este proyecto es de uso académico para la materia de Ingeniería Web.

