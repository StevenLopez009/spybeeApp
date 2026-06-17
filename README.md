# SpybeeApp

Sistema de gestión y visualización de incidencias basado en mapas interactivos y analítica operacional.

SpybeeApp permite registrar incidencias georreferenciadas sobre un mapa Mapbox, visualizar información detallada en tiempo real y consultar métricas operativas mediante un dashboard analítico.

---

# Tecnologías

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript 5
* Sass Modules
* Ant Design 6
* Zustand
* Recharts
* Mapbox GL JS

## Herramientas

* Dayjs
* React Day Picker

---

# Arquitectura

El proyecto sigue una arquitectura **Feature-Based**, donde cada dominio encapsula sus componentes, hooks, estado, servicios y lógica de negocio.

```txt
app/
├── page.tsx
├── reports/
│   ├── page.tsx
│   └── loading.tsx
├── api/
│   └── incidents/

features/
├── incidents/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── constants/

├── reports/
│   ├── components/
│   ├── hooks/
│   ├── selectors/
│   ├── services/
│   ├── store/
│   └── types/

├── navigation/
│   ├── components/
│   └── hooks/

styles/
├── abstracts/
└── global.scss
```

---

# Arquitectura de Datos

La lógica de transformación de datos se mantiene fuera de los componentes visuales.

```txt
API
 ↓
Service Layer
 ↓
Zustand Store
 ↓
Selectors
 ↓
Custom Hooks
 ↓
UI Components
```

Beneficios:

* Separación de responsabilidades.
* Reutilización de lógica.
* Componentes más simples.
* Facilidad para testing.

---

# Flujo de Datos

## Creación de Incidencias

```txt
Usuario
 ↓
Click en el mapa
 ↓
Mapbox Reverse Geocoding
 ↓
Ubicación seleccionada
 ↓
IncidentForm
 ↓
POST /api/incidents
 ↓
Creación de marcador
 ↓
IncidentSidebar
```

### Flujo visual

```txt
Mapa
 ↓
Ubicación
 ↓
Formulario
 ↓
Incidencia
 ↓
Marcador 🚨
 ↓
Detalle
```

---

## Dashboard de Reportes

```txt
Server Component
 ↓
getIncidents()
 ↓
ReportsClient
 ↓
Zustand Store
 ↓
Selectors
 ↓
useReports()
 ↓
Charts / KPIs / Tables
```

---

# Gestión de Estado

Se utiliza Zustand como solución global de estado.

## Estado Compartido

```txt
reports.store.ts
```

Contiene:

* Incidencias
* Filtros
* Fecha seleccionada
* Rango de fechas

## Estado Local

Se utiliza React State para:

* Formularios
* Modales
* Sidebar
* Interacciones del mapa

---

# Rendimiento

## Estrategias Implementadas

### Server Components

El dashboard obtiene datos mediante Server Components.

```txt
reports/page.tsx
```

Beneficios:

* Menos JavaScript enviado al navegador.
* Mejor tiempo de carga inicial.

---

### Streaming

Se utiliza:

```txt
app/reports/loading.tsx
```

para mostrar un skeleton mientras se obtiene la información.

---

### Memoización

Los cálculos complejos del dashboard se encuentran memoizados mediante:

```txt
useMemo()
```

en:

```txt
hooks/useReports.ts
```

---

### Selectores Puros

La agregación de datos vive en:

```txt
selectors/reports.selector.ts
```

evitando recalcular métricas dentro de los componentes.

---

### Code Splitting

Componentes pesados como:

* HeatMap
* RadarChart
* TrendChart

pueden cargarse mediante:

```txt
next/dynamic()
```

para reducir el tamaño del bundle inicial.

---

### Resize Inteligente de Mapbox

El mapa utiliza:

```txt
ResizeObserver
```

para mantener el canvas sincronizado con cambios de tamaño y navegación lateral.

---

# Métricas de Rendimiento

Entorno local de desarrollo:

| Métrica          | Valor aproximado |
| ---------------- | ---------------- |
| Home Route       | 20–50 ms         |
| Reports Route    | 700–900 ms       |
| API Mock POST    | 250–350 ms       |
| Dashboard Render | < 1 s            |
| Mapa Inicial     | < 500 ms         |

## Optimizaciones Aplicadas

* SSR para dashboard.
* Streaming con Suspense.
* Zustand para evitar prop drilling.
* Memoización de selectores.
* Sass Modules.
* Lazy Loading para componentes pesados.
* Renderizado incremental de gráficos.

---

# Responsive Design

## Desktop

* Side Navigation expandible.
* Dashboard multipanel.
* Toolbar flotante de mapa.

## Mobile

* Bottom Navigation.
* Botón flotante para incidencias.
* Layout adaptativo.
* Ajuste automático del canvas Mapbox.

Breakpoints:

| Nombre | Tamaño |
| ------ | ------ |
| sm     | 640px  |
| md     | 768px  |
| lg     | 1024px |
| xl     | 1280px |

---

# Variables de Entorno

```env
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_INCIDENTS_URL=
```

---

# Roadmap

## Próximas mejoras

* Persistencia con PostgreSQL.
* Prisma ORM.
* Autenticación y autorización.
* Exportación PDF.
* Exportación Excel.
* Dark Mode.
* Storybook.
* Vitest.
* Cypress.
* CI/CD con GitHub Actions.

---

# Autor

Proyecto desarrollado como demostración de una aplicación moderna basada en Next.js, React, TypeScript, Mapbox y analítica geoespacial.

