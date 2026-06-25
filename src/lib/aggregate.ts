import type {
  ClientRecord,
  DropoutReason,
  KpiDelta,
  MonthData,
  OriginCount,
} from '../types';
import {
  MONTH_KEYS,
  MONTH_LABELS,
  MONTH_SHORT,
  autoPreviousMonthKey,
} from './months';

/* ------------------------------------------------------------------ *
 *  Helpers de fecha
 * ------------------------------------------------------------------ */

function isSameMonth(date: Date, year: number, monthIndex: number): boolean {
  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

function firstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/* ------------------------------------------------------------------ *
 *  Agregación principal: lista de clientes  →  KPIs por mes
 * ------------------------------------------------------------------ */

/**
 * Calcula los KPIs mes a mes a partir del listado de clientes del CRM.
 *
 * Definiciones (derivadas de las fechas de alta y baja de cada cliente):
 *
 *  - Clientes nuevos del mes  → altas cuya "Fecha Alta" cae en ese mes.
 *  - Bajas del mes            → clientes cuya "Fecha Baja" cae en ese mes.
 *  - Clientes activos del mes → clientes que ya estaban dados de alta y que
 *    todavía no se habían dado de baja antes de empezar el mes. Es decir, su
 *    relación con la clínica solapa con ese mes. (Como el CRM no guarda las
 *    sesiones una a una, esta es la mejor aproximación a "ha tenido al menos
 *    una sesión ese mes": el paciente estaba en activo durante el mes.)
 *  - Crecimiento neto         → nuevos − bajas.
 *
 * Se genera un mes por cada mes con actividad, desde la primera alta hasta
 * el último mes con altas o bajas.
 */
export function computeMonthlyData(clients: ClientRecord[]): MonthData[] {
  if (clients.length === 0) return [];

  // Rango temporal: del primer mes con alta al último mes con actividad.
  const monthStamps: number[] = [];
  for (const c of clients) {
    monthStamps.push(firstDayOfMonth(c.fechaAlta).getTime());
    if (c.fechaBaja) monthStamps.push(firstDayOfMonth(c.fechaBaja).getTime());
  }
  const start = new Date(Math.min(...monthStamps));
  const end = new Date(Math.max(...monthStamps));

  const months: MonthData[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

  while (cursor <= end) {
    const year = cursor.getFullYear();
    const idx = cursor.getMonth();
    const monthStart = new Date(year, idx, 1);
    const monthEnd = new Date(year, idx + 1, 0, 23, 59, 59, 999);

    const nuevosClientes = clients.filter((c) => isSameMonth(c.fechaAlta, year, idx));
    const bajasClientes = clients.filter(
      (c) => c.fechaBaja !== null && isSameMonth(c.fechaBaja, year, idx),
    );
    const activos = clients.filter(
      (c) => c.fechaAlta <= monthEnd && (c.fechaBaja === null || c.fechaBaja >= monthStart),
    ).length;

    months.push({
      key: MONTH_KEYS[idx],
      year,
      index: idx,
      shortLabel: MONTH_SHORT[MONTH_KEYS[idx]],
      label: MONTH_LABELS[MONTH_KEYS[idx]],
      monthLabel: `${MONTH_LABELS[MONTH_KEYS[idx]]} ${year}`,
      clientesNuevos: nuevosClientes.length,
      clientesActivos: activos,
      bajas: bajasClientes.length,
      crecimientoNeto: nuevosClientes.length - bajasClientes.length,
      motivosBaja: groupDropoutReasons(bajasClientes),
      origenNuevos: groupOrigins(nuevosClientes),
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

/** Agrupa los clientes de baja por motivo, ordenado de mayor a menor. */
function groupDropoutReasons(bajas: ClientRecord[]): DropoutReason[] {
  const map = new Map<string, number>();
  for (const c of bajas) {
    const motivo = c.motivoBaja ?? 'Sin especificar';
    map.set(motivo, (map.get(motivo) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([motivo, cantidad]) => ({ motivo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/** Agrupa por canal de captación, ordenado de mayor a menor. */
function groupOrigins(clientes: ClientRecord[]): OriginCount[] {
  const map = new Map<string, number>();
  for (const c of clientes) {
    map.set(c.origen, (map.get(c.origen) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([origen, cantidad]) => ({ origen, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/* ------------------------------------------------------------------ *
 *  Selección de mes y comparativas
 * ------------------------------------------------------------------ */

/** Busca un mes por su clave ("mayo"). Si hay varios años, devuelve el más reciente. */
export function getMonthByKey(months: MonthData[], key: string): MonthData | null {
  const matches = months.filter((m) => m.key === key);
  if (matches.length === 0) return null;
  return matches.reduce((latest, m) => (m.year > latest.year ? m : latest));
}

/**
 * Resuelve la selección del usuario a un mes concreto.
 *  - "auto" → mes anterior al de hoy (último mes cerrado). Si no hay datos de
 *    ese mes, usa el último mes disponible.
 *  - una clave de mes ("marzo") → ese mes.
 */
export function resolveSelectedMonth(
  months: MonthData[],
  selection: string,
  today: Date = new Date(),
): MonthData | null {
  if (months.length === 0) return null;

  if (selection === 'auto') {
    const autoKey = autoPreviousMonthKey(today);
    return getMonthByKey(months, autoKey) ?? months[months.length - 1];
  }

  return getMonthByKey(months, selection);
}

/** Devuelve el mes inmediatamente anterior (con datos) al mes dado. */
export function getPreviousMonth(months: MonthData[], current: MonthData): MonthData | null {
  const idx = months.findIndex((m) => m.key === current.key && m.year === current.year);
  if (idx <= 0) return null;
  return months[idx - 1];
}

/** Construye la comparativa de un KPI frente al mes anterior. */
export function buildDelta(current: number, previous: number | null): KpiDelta {
  if (previous === null || previous === undefined) {
    return {
      current,
      previous: null,
      diff: null,
      pct: null,
      direction: 'flat',
      hasPrevious: false,
    };
  }

  const diff = current - previous;
  const pct = previous === 0 ? null : (diff / previous) * 100;
  const direction: KpiDelta['direction'] = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';

  return { current, previous, diff, pct, direction, hasPrevious: true };
}
