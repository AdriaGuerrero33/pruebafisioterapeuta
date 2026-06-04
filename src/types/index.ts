/**
 * Tipos de datos del dashboard.
 *
 * El CRM real (Google Sheets) tiene UNA FILA POR CLIENTE con estas columnas:
 *
 *   ID Cliente | Nombre | Fecha Alta | Estado | Fecha Baja | Motivo Baja | Origen
 *
 * El dashboard NO necesita una hoja con totales mensuales pre-calculados:
 * a partir de este listado de clientes calcula automáticamente, mes a mes,
 * los clientes nuevos, los activos, las bajas y los motivos de baja.
 */

/** Fila tal y como llega de la hoja / CSV (todos los campos son texto). */
export interface RawClientRow {
  idCliente: string;
  nombre: string;
  /** Fecha de alta en formato DD/MM/AAAA (como en Google Sheets). */
  fechaAlta: string;
  /** "Activo" | "Baja" | "Nuevo" ... */
  estado: string;
  /** Fecha de baja en DD/MM/AAAA, vacía si el cliente sigue activo. */
  fechaBaja: string;
  /** Motivo de la baja, vacío si no es baja. */
  motivoBaja: string;
  /** Canal de captación: "Google Ads" | "Instagram" | "Referido" ... */
  origen: string;
}

/** Cliente ya normalizado (fechas convertidas a Date, vacíos a null). */
export interface ClientRecord {
  idCliente: string;
  nombre: string;
  fechaAlta: Date;
  estado: string;
  fechaBaja: Date | null;
  motivoBaja: string | null;
  origen: string;
}

/** Un motivo de baja con su recuento (para la tabla tipo Search Console). */
export interface DropoutReason {
  motivo: string;
  cantidad: number;
}

/** Canal de captación con su recuento. */
export interface OriginCount {
  origen: string;
  cantidad: number;
}

/** KPIs ya agregados de un mes concreto. */
export interface MonthData {
  /** Clave en minúsculas: "enero", "febrero"... */
  key: string;
  /** Año al que pertenece el mes (el CRM puede abarcar varios años). */
  year: number;
  /** Índice 0–11 dentro del año. */
  index: number;
  /** Etiqueta corta para gráficos: "Ene", "Feb"... */
  shortLabel: string;
  /** Etiqueta completa: "Enero". */
  label: string;
  /** Etiqueta con año: "Enero 2026". */
  monthLabel: string;

  clientesNuevos: number;
  clientesActivos: number;
  bajas: number;
  /** Altas netas del mes = nuevos − bajas. */
  crecimientoNeto: number;

  motivosBaja: DropoutReason[];
  origenNuevos: OriginCount[];
}

/** Selección del usuario: un mes concreto o "auto" (último mes cerrado). */
export type MonthSelection = 'auto' | string;

/** Resultado de comparar un KPI con el mes anterior. */
export interface KpiDelta {
  current: number;
  previous: number | null;
  /** current − previous (null si no hay mes anterior). */
  diff: number | null;
  /** Variación porcentual (null si no hay base de comparación). */
  pct: number | null;
  direction: 'up' | 'down' | 'flat';
  hasPrevious: boolean;
}
