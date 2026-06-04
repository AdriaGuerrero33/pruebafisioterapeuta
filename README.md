# Panel de control · Clínica de Fisioterapia

Dashboard web tipo **SaaS** para una clínica de fisioterapia. Muestra, mes a
mes, los KPIs del negocio (clientes nuevos, clientes activos, bajas y motivos
de baja) a partir del **CRM de la clínica en Google Sheets**.

La demo funciona con datos simulados que reproducen exactamente el CRM real, y
está preparada para conectarse a la hoja de Google Sheets cambiando un único
archivo de configuración.

![Estado](https://img.shields.io/badge/demo-funcional-2f70bd) ![Stack](https://img.shields.io/badge/React%20+%20Vite%20+%20Tailwind-1e5aa8)

---

## ✨ Qué incluye

- **Resumen inteligente del mes (IA):** texto automático que interpreta los KPIs,
  compara con el mes anterior y propone una recomendación según el principal
  motivo de baja.
- **Tarjetas de KPIs:** clientes nuevos, clientes activos, bajas y crecimiento
  neto, cada una con su comparativa respecto al mes anterior.
- **Gráfico de evolución mensual:** líneas de nuevos / activos / bajas, con
  selectores tipo Search Console para activar o desactivar cada métrica.
- **Motivos de baja (estilo Search Console):** tabla con motivo, número de bajas,
  porcentaje y barra proporcional.
- **Origen de captación:** de dónde llegan los clientes nuevos del mes
  (Google Ads, Instagram, Referido…).
- **Selector de mes** con opción **"Mes anterior (automático)"**.
- Diseño limpio (blanco / azul / verde azulado), responsive y profesional.

---

## 🚀 Puesta en marcha (local)

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar en modo desarrollo (datos de demo)
npm run dev
# Abre la URL que aparece (por defecto http://localhost:5173)

# 3. Compilar para producción
npm run build
npm run preview   # previsualiza el build
```

Por defecto arranca con **datos de demostración**, así que funciona sin
configurar nada.

---

## 📊 Cómo se calculan los datos

El CRM tiene **una fila por cliente** con estas columnas:

| Columna       | Ejemplo               |
| ------------- | --------------------- |
| `ID Cliente`  | CL001                 |
| `Nombre`      | Juan Pérez            |
| `Fecha Alta`  | 05/01/2026            |
| `Estado`      | Activo / Baja / Nuevo |
| `Fecha Baja`  | 15/03/2026 (o vacío)  |
| `Motivo Baja` | Precio (o vacío)      |
| `Origen`      | Google Ads            |

El dashboard **no necesita una hoja con totales mensuales**: calcula todos los
KPIs a partir de este listado. Las definiciones son:

- **Clientes nuevos del mes** → altas cuya `Fecha Alta` cae en ese mes.
- **Bajas del mes** → clientes cuya `Fecha Baja` cae en ese mes.
- **Clientes activos del mes** → clientes ya dados de alta y todavía no dados de
  baja antes de ese mes (su relación con la clínica solapa con el mes).
  > Como el CRM no guarda las sesiones una a una, esta es la mejor aproximación
  > a "ha tenido al menos una sesión ese mes": el paciente estaba activo durante
  > el mes. Si más adelante se añade una hoja de sesiones, se puede afinar.
- **Crecimiento neto** → nuevos − bajas.
- **Motivos de baja** → se agrupan las bajas del mes por su `Motivo Baja`.

> Toda esta lógica está en [`src/lib/aggregate.ts`](src/lib/aggregate.ts) y se
> puede revisar o ajustar fácilmente.

### Selector de mes y "Mes anterior (automático)"

El selector permite elegir cualquier mes con datos. La opción **"Mes anterior
(automático)"** muestra siempre **el último mes cerrado**, es decir, el mes
anterior al actual:

- Si hoy es **1 de marzo** → muestra **febrero**.
- Si hoy es **15 de marzo** → muestra **febrero**.
- Si hoy es **4 de junio** → muestra **mayo**.

Así, cada día 1 de mes el panel pasa automáticamente a enseñar el mes que acaba
de terminar. La lógica está en `autoPreviousMonthKey()`
([`src/lib/months.ts`](src/lib/months.ts)).

---

## 🔌 Conectar con Google Sheets

La conexión usa el endpoint público de Google (formato CSV), así que **no hace
falta ninguna clave de API ni librería externa**.

**1. Prepara la hoja**

- Abre tu Google Sheet del CRM.
- Asegúrate de que la primera fila son las cabeceras
  (`ID Cliente`, `Nombre`, `Fecha Alta`, `Estado`, `Fecha Baja`,
  `Motivo Baja`, `Origen`).
- Comparte la hoja: **Compartir → Acceso general → "Cualquier persona con el
  enlace" → Lector**. (O bien `Archivo → Compartir → Publicar en la web`.)

**2. Copia el ID de la hoja**

Está en la URL, entre `/d/` y `/edit`:

```
https://docs.google.com/spreadsheets/d/  ESTE_ES_EL_ID  /edit#gid=0
```

**3. Crea el archivo `.env`**

Copia `.env.example` a `.env` y rellénalo:

```bash
cp .env.example .env
```

```env
VITE_DATA_SOURCE=sheets
VITE_GOOGLE_SHEET_ID=PEGA_AQUI_EL_ID_DE_TU_HOJA
VITE_GOOGLE_SHEET_NAME=Clientes
```

(`VITE_GOOGLE_SHEET_NAME` es el nombre de la pestaña donde está el listado de
clientes; por defecto `Clientes`.)

**4. Reinicia el servidor** (`npm run dev`). El dashboard leerá directamente de
tu hoja. El indicador de la barra lateral pasará a **"Google Sheets · en vivo"**.

> Si la conexión falla (hoja privada, sin internet…), el dashboard no se rompe:
> avisa por consola y sigue mostrando los datos de demo.

El mapeo de columnas es tolerante con mayúsculas, tildes y espacios, y la lógica
está en [`src/lib/googleSheets.ts`](src/lib/googleSheets.ts).

---

## 🗂️ Estructura del proyecto

```
src/
├── components/            Componentes de UI
│   ├── ui/Card.tsx        Tarjeta base reutilizable
│   ├── Logo.tsx           Logo (SVG vectorial)
│   ├── Sidebar.tsx        Barra lateral + cajón móvil
│   ├── Topbar.tsx         Cabecera con selector de mes
│   ├── MonthSelector.tsx  Selector de mes (+ modo automático)
│   ├── AiSummaryCard.tsx  Resumen inteligente del mes
│   ├── KpiCard.tsx        Tarjeta de KPI con comparativa
│   ├── EvolutionChart.tsx Gráfico de líneas mensual
│   ├── DropoutReasons.tsx Tabla de motivos de baja
│   ├── OriginBreakdown.tsx Donut de origen de captación
│   └── Dashboard.tsx      Página principal (orquesta todo)
├── data/
│   └── mockClients.ts     Datos de demo (= estructura del CRM real)
├── hooks/
│   └── useClinicData.ts   Carga datos + calcula KPIs
├── lib/
│   ├── googleSheets.ts    Fuente de datos (demo o Google Sheets)
│   ├── clients.ts         Normaliza filas del CRM
│   ├── aggregate.ts       Cálculo de KPIs por mes  ← lógica clave
│   ├── aiSummary.ts       Generador del resumen IA
│   ├── months.ts          Utilidades de meses
│   └── format.ts          Formateo de números (es-ES)
├── types/index.ts         Tipos de datos
├── App.tsx                Layout general
└── main.tsx               Punto de entrada
```

---

## 🎨 Personalización

- **Colores de marca:** en [`tailwind.config.js`](tailwind.config.js) (paletas
  `brand` y `teal`).
- **Logo:** está recreado como SVG en [`src/components/Logo.tsx`](src/components/Logo.tsx).
  Para usar tu imagen original, ponla en `public/logo.png` y, dentro de `Logo.tsx`,
  sustituye `<LogoSymbol/>` por `<img src="/logo.png" alt="Fisioterapia" width={size} height={size} />`.
- **Datos de demo:** en [`src/data/mockClients.ts`](src/data/mockClients.ts).
- **Definiciones de KPIs:** en [`src/lib/aggregate.ts`](src/lib/aggregate.ts).

---

## 🛠️ Tecnología

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (desarrollo y build)
- [Tailwind CSS](https://tailwindcss.com) (estilos)
- [Recharts](https://recharts.org) (gráficos)
- [Lucide](https://lucide.dev) (iconos)

---

## 📌 Notas

Esta es una **demo**: el resumen "IA" se genera con reglas locales (sin llamar a
ningún servicio externo), por lo que funciona sin claves ni costes. Si en el
futuro se quiere un resumen redactado por un modelo de lenguaje, basta con
sustituir `generateMonthlySummary()` por una llamada a la API correspondiente
pasándole los mismos datos del mes.
