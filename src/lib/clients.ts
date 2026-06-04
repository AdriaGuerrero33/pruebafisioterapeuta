import type { ClientRecord, RawClientRow } from '../types';

/**
 * Convierte una fecha de Google Sheets ("DD/MM/AAAA") a Date.
 * Devuelve null si está vacía o no es válida.
 * Acepta también separadores con "-" y el formato ISO (AAAA-MM-DD) por si acaso.
 */
export function parseSheetDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const s = String(value).trim();
  if (s === '') return null;

  // Formato europeo DD/MM/AAAA o DD-MM-AAAA
  const dmy = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10);
    const year = parseInt(dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3], 10);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Fallback: ISO u otros formatos reconocidos por Date
  const iso = new Date(s);
  return Number.isNaN(iso.getTime()) ? null : iso;
}

/**
 * Normaliza las filas crudas del CRM (texto) a registros con tipos correctos.
 * Descarta filas sin ID o sin fecha de alta válida.
 */
export function parseClients(rows: RawClientRow[]): ClientRecord[] {
  const records: ClientRecord[] = [];

  for (const row of rows) {
    const idCliente = (row.idCliente ?? '').trim();
    const fechaAlta = parseSheetDate(row.fechaAlta);
    if (idCliente === '' || fechaAlta === null) continue;

    const motivo = (row.motivoBaja ?? '').trim();

    records.push({
      idCliente,
      nombre: (row.nombre ?? '').trim(),
      fechaAlta,
      estado: (row.estado ?? '').trim(),
      fechaBaja: parseSheetDate(row.fechaBaja),
      motivoBaja: motivo === '' ? null : motivo,
      origen: (row.origen ?? '').trim() || 'Sin origen',
    });
  }

  return records;
}
