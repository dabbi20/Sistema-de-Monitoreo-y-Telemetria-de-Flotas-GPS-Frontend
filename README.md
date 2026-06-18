# Fleet Telemetry Frontend

SPA desarrollada en Angular para el monitoreo en tiempo real de una flota de vehículos GPS.

La aplicación consume la API REST del proyecto **Fleet Telemetry System Backend** y permite visualizar vehículos, estados operativos, métricas, eventos de telemetría y ubicación geográfica mediante un mapa interactivo.

---

# Descripción General

El objetivo de este proyecto es proporcionar una interfaz web que permita supervisar el comportamiento de una flota GPS en tiempo real.

Desde el dashboard es posible visualizar:

* Total de vehículos monitoreados.
* Vehículos en movimiento.
* Vehículos detenidos.
* Vehículos sin señal.
* Última ubicación reportada por cada vehículo.
* Historial de eventos generados por el backend.
* Métricas operativas.
* Información detallada de cada vehículo.
* Actualización automática cada 5 segundos.

---

# Tecnologías Utilizadas

* Angular 21
* TypeScript
* SCSS
* Tailwind CSS
* Leaflet
* RxJS
* Vitest
* Angular Testing Utilities
* HTML5
* CSS3
* Docker
* Nginx

---

# Arquitectura del Frontend

El proyecto se estructuró siguiendo una separación simple de responsabilidades:

```text
Componentes
    ↓
Servicios
    ↓
API REST
```

Estructura principal:

```text
src/app
│
├── core
│   └── services
│       └── vehicle.service.ts
│
├── features
│   └── dashboard
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       ├── dashboard.component.scss
│       └── dashboard.component.spec.ts
│
└── models
    ├── vehicle.model.ts
    └── telemetry-event.model.ts
```

---

# Decisiones de Arquitectura

Se eligió Angular por su arquitectura basada en componentes, tipado fuerte mediante TypeScript y facilidad para construir aplicaciones escalables y mantenibles.

### DashboardComponent

Responsable de:

* Mostrar métricas.
* Mostrar vehículos.
* Mostrar eventos.
* Gestionar el mapa.
* Actualizar la información cada 5 segundos.
* Gestionar la selección de vehículos.

### VehicleService

Responsable de:

* Centralizar las llamadas HTTP.
* Consumir la API REST.
* Aislar la lógica de comunicación con el backend.

### Modelos

Responsables de:

* Tipar los datos recibidos.
* Mantener consistencia entre frontend y backend.
* Facilitar el mantenimiento del proyecto.

---

# Funcionalidades Implementadas

| Funcionalidad                      | Estado |
| ---------------------------------- | ------ |
| SPA Angular                        | ✅      |
| Dashboard principal                | ✅      |
| Listado de vehículos               | ✅      |
| Indicadores visuales por estado    | ✅      |
| Métricas en tiempo real            | ✅      |
| Mapa con Leaflet                   | ✅      |
| Marcadores por vehículo            | ✅      |
| Popup con información del vehículo | ✅      |
| Historial de eventos               | ✅      |
| Detalle de vehículo                | ✅      |
| Polling cada 5 segundos            | ✅      |
| Última actualización visible       | ✅      |
| Pruebas unitarias                  | ✅      |
| Docker                             | ✅      |

---

# Cumplimiento de Requisitos de la Prueba

| Requisito                                | Estado |
| ---------------------------------------- | ------ |
| SPA Web                                  | ✅      |
| Consumo API REST                         | ✅      |
| Listado de vehículos                     | ✅      |
| Indicadores visuales de estado           | ✅      |
| Integración Leaflet                      | ✅      |
| Marcadores por vehículo                  | ✅      |
| Popup informativo                        | ✅      |
| Actualización automática cada 5 segundos | ✅      |
| Visualización de eventos                 | ✅      |
| Visualización de métricas                | ✅      |
| Última actualización visible             | ✅      |
| Pruebas unitarias                        | ✅      |
| Docker                                   | ✅      |

---

# Consumo de API

El frontend consume los siguientes endpoints:

```http
GET /vehicles
```

Obtiene el estado actual de la flota.

```http
GET /events
```

Obtiene el historial de eventos registrados por el backend.

```http
GET /metrics
```

Obtiene métricas globales de la flota.

---

# Estados Visuales

| Estado Backend | Estado Frontend | Color    |
| -------------- | --------------- | -------- |
| EN_MOVIMIENTO  | En movimiento   | Verde    |
| DETENIDO       | Detenido        | Amarillo |
| SIN_SENAL      | Sin señal       | Rojo     |

---

# Integración con Leaflet

Se utilizó Leaflet para visualizar la última posición reportada por cada vehículo.

Cada marcador cambia de color según el estado del vehículo:

* 🟢 En movimiento
* 🟡 Detenido
* 🔴 Sin señal

Al seleccionar un marcador se muestra:

* ID del vehículo
* Estado actual
* Latitud
* Longitud
* Última transmisión

---

# Actualización Automática

La actualización se realiza mediante polling cada 5 segundos.

```ts
interval(5000).subscribe(() => {
  this.loadVehicles();
  this.loadEvents();
});
```

Esta estrategia fue seleccionada porque:

* Cumple directamente con el requisito obligatorio de la prueba.
* Es simple de implementar y mantener.
* Resulta suficiente para una simulación de telemetría en tiempo real.

---

# Consideración sobre SSE

El enunciado menciona Server-Sent Events (SSE) como funcionalidad opcional.

Se decidió utilizar polling porque:

* Cumple el requisito obligatorio.
* Reduce la complejidad del backend.
* Es suficiente para el alcance del MVP.

Como mejora futura podría incorporarse SSE o WebSockets para recibir actualizaciones en tiempo real sin consultas periódicas.

---

# Pruebas Unitarias

Se implementaron pruebas unitarias para validar los componentes y servicios principales.

## DashboardComponent

Valida:

* Creación correcta del componente.
* Formateo de estados.
* Conversión de estados a texto amigable.
* Obtención de iconos visuales.

## VehicleService

Valida:

* Consumo de GET /vehicles.
* Consumo de GET /events.

Ejecutar pruebas:

```bash
ng test
```

Resultado:

```text
Test Files  3 passed (3)
Tests       7 passed (7)
```

---

# Ejecución Rápida

Tal como solicita la prueba técnica, el proyecto puede ejecutarse localmente con tres comandos:

```bash
git clone https://github.com/dabbi20/fleet-telemetry-frontend.git
cd fleet-telemetry-frontend
npm install && ng serve
```

Aplicación disponible en:

```text
http://localhost:4200
```

---

# Ejecución con Docker

Construir imagen:

```bash
docker build -t fleet-telemetry-frontend .
```

Ejecutar contenedor:

```bash
docker run -d --name fleet-telemetry-frontend -p 4200:80 fleet-telemetry-frontend
```

Aplicación disponible en:

```text
http://localhost:4200
```

---

# Requisitos Previos

El backend debe estar ejecutándose previamente.

Backend:

```text
http://localhost:8082
```

Endpoints consumidos:

```text
GET /vehicles
GET /events
GET /metrics
```

---

# Comandos Útiles

Instalar dependencias:

```bash
npm install
```

Ejecutar aplicación:

```bash
ng serve
```

Ejecutar pruebas:

```bash
ng test
```

Generar build:

```bash
npm run build
```

Construir Docker:

```bash
docker build -t fleet-telemetry-frontend .
```

Ejecutar Docker:

```bash
docker run -d --name fleet-telemetry-frontend -p 4200:80 fleet-telemetry-frontend
```

---

# Reporte de IA

## 1. ¿Qué herramientas de IA utilicé?

Durante el desarrollo de la solución utilicé principalmente:

* ChatGPT
* GitHub Copilot

Estas herramientas fueron utilizadas como asistentes de desarrollo para acelerar tareas de implementación, análisis técnico, resolución de problemas y documentación, manteniendo siempre la validación y revisión manual de cada decisión tomada.

---

## 2. ¿Para qué tareas específicas me apoyé en IA?

La IA fue utilizada como apoyo en diferentes etapas del proyecto:

* Diseño inicial de la arquitectura del frontend.
* Integración de Leaflet para la visualización geográfica.
* Construcción del dashboard.
* Implementación del mecanismo de polling.
* Resolución de problemas de integración Angular-Spring Boot.
* Diagnóstico y corrección de errores de CORS.
* Generación y ajuste de pruebas unitarias.
* Revisión de buenas prácticas.
* Elaboración de documentación técnica.

Todas las decisiones finales fueron revisadas y adaptadas según los requerimientos reales de la prueba.

---

## 3. ¿Qué error de la IA encontré y cómo lo corregí?

Durante el desarrollo encontré situaciones donde las sugerencias iniciales de la IA no coincidían completamente con el comportamiento real de la aplicación.

Uno de los casos más relevantes ocurrió durante la integración entre frontend y backend. Algunas propuestas asumían estructuras de datos y formatos de fechas distintos a los retornados por la API, por lo que fue necesario inspeccionar manualmente las respuestas del backend y adaptar la lógica del dashboard para representar correctamente eventos, estados y tiempos relativos.

También se evaluaron propuestas que añadían complejidad innecesaria para el alcance de la prueba. Después de analizar dichas alternativas, se optó por soluciones más simples enfocadas en el monitoreo en tiempo real, la claridad visual y el cumplimiento de los requisitos funcionales.

Esta experiencia reforzó la importancia de utilizar la IA como herramienta de apoyo y no como sustituto del criterio técnico del desarrollador.

---

# Video de Sustentación

Enlace:

https://youtu.be/HmQwG2waTMU

---

# Estado del Proyecto

Proyecto finalizado en versión MVP funcional.

La aplicación cumple los requisitos principales de la prueba técnica e incorpora funcionalidades adicionales como:

* Métricas en tiempo real.
* Historial de eventos.
* Detalle de vehículo.
* Pruebas unitarias.
* Dockerización completa.

---

# Autor

## David Carrasco

Ingeniero de Sistemas 
Especialización en Desarrollo de Software y Automatizaciones
Desarrollador Fullstack

GitHub:

https://github.com/dabbi20
