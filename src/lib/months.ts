/** Utilidades de meses en español. */

export const MONTH_KEYS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export type MonthKey = (typeof MONTH_KEYS)[number];

export const MONTH_LABELS: Record<string, string> = {
  enero: 'Enero',
  febrero: 'Febrero',
  marzo: 'Marzo',
  abril: 'Abril',
  mayo: 'Mayo',
  junio: 'Junio',
  julio: 'Julio',
  agosto: 'Agosto',
  septiembre: 'Septiembre',
  octubre: 'Octubre',
  noviembre: 'Noviembre',
  diciembre: 'Diciembre',
};

export const MONTH_SHORT: Record<string, string> = {
  enero: 'Ene',
  febrero: 'Feb',
  marzo: 'Mar',
  abril: 'Abr',
  mayo: 'May',
  junio: 'Jun',
  julio: 'Jul',
  agosto: 'Ago',
  septiembre: 'Sep',
  octubre: 'Oct',
  noviembre: 'Nov',
  diciembre: 'Dic',
};

/** Índice 0–11 de una clave de mes ("marzo" → 2). */
export function monthIndex(key: string): number {
  return MONTH_KEYS.indexOf(key as MonthKey);
}

/**
 * Calcula la clave del mes anterior al de la fecha indicada.
 *
 * Es la lógica de "Mes anterior (automático)": cualquier día de un mes
 * muestra el mes anterior, que es el último mes ya cerrado.
 *   - 1 de marzo  → "febrero"
 *   - 15 de marzo → "febrero"
 *   - 4 de junio  → "mayo"
 */
export function autoPreviousMonthKey(today: Date = new Date()): MonthKey {
  const prevIndex = (today.getMonth() - 1 + 12) % 12;
  return MONTH_KEYS[prevIndex];
}
