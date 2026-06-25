/** Formateo de números en español (es-ES). */

const numberFormatter = new Intl.NumberFormat('es-ES');

/** 1234 → "1.234" */
export function formatNumber(n: number): string {
  return numberFormatter.format(n);
}

/** Porcentaje con signo: 12.3 → "+12 %", -8 → "−8 %", null → "—" */
export function formatPercent(pct: number | null): string {
  if (pct === null || !Number.isFinite(pct)) return '—';
  const rounded = Math.round(pct);
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : '';
  return `${sign}${Math.abs(rounded)} %`;
}

/** Diferencia con signo: 4 → "+4", -3 → "−3", null → "—" */
export function formatSignedDiff(diff: number | null): string {
  if (diff === null) return '—';
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '';
  return `${sign}${Math.abs(diff)}`;
}
