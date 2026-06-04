import type { RawClientRow } from '../types';
import { mockClients } from '../data/mockClients';

/**
 * Capa de acceso a datos.
 * ----------------------------------------------------------------------------
 * `fetchClients()` es el ÚNICO punto del que el dashboard obtiene los datos.
 *
 *  - Por defecto devuelve los datos de DEMO (src/data/mockClients.ts).
 *  - Si en el archivo .env se define  VITE_DATA_SOURCE=sheets  y un
 *    VITE_GOOGLE_SHEET_ID, leerá directamente de tu Google Sheet.
 *
 * No hace falta tocar ningún componente para cambiar de demo a datos reales:
 * solo el archivo .env. Ver el README ("Conectar con Google Sheets").
 */

export type DataSource = 'mock' | 'sheets';

export function getDataSource(): DataSource {
  const source = import.meta.env.VITE_DATA_SOURCE;
  if (source === 'sheets' && import.meta.env.VITE_GOOGLE_SHEET_ID) return 'sheets';
  return 'mock';
}

/** Obtiene la lista de clientes del CRM (demo o Google Sheets). */
export async function fetchClients(): Promise<RawClientRow[]> {
  if (getDataSource() === 'sheets') {
    try {
      return await fetchClientsFromGoogleSheets();
    } catch (error) {
      // Si falla la conexión, no rompemos la demo: avisamos y usamos los mock.
      console.error('[Fisioterapia] No se pudo leer Google Sheets, usando datos de demo:', error);
      return mockClients;
    }
  }

  // Pequeño retardo simulado para que la demo muestre el estado de carga.
  await new Promise((resolve) => setTimeout(resolve, 350));
  return mockClients;
}

/* ------------------------------------------------------------------ *
 *  Lectura real desde Google Sheets (sin librerías ni claves de API)
 * ------------------------------------------------------------------ *
 *
 *  Usamos el endpoint público "gviz" de Google, que devuelve la pestaña en
 *  formato CSV. Solo requiere que la hoja sea visible con el enlace
 *  ("Cualquiera con el enlace: Lector") o que esté publicada en la web.
 *
 *      https://docs.google.com/spreadsheets/d/<ID>/gviz/tq?tqx=out:csv&sheet=<PESTAÑA>
 */
async function fetchClientsFromGoogleSheets(): Promise<RawClientRow[]> {
  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const sheetName = import.meta.env.VITE_GOOGLE_SHEET_NAME || 'Clientes';

  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets respondió con estado ${response.status}`);
  }

  const csv = await response.text();
  return mapRowsToClients(parseCsv(csv));
}

/* ------------------------------------------------------------------ *
 *  Parseo de CSV (soporta comillas, comas internas y saltos de línea)
 * ------------------------------------------------------------------ */

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/* ------------------------------------------------------------------ *
 *  Mapeo de columnas del CRM a nuestro modelo
 * ------------------------------------------------------------------ *
 *
 *  Tolerante con el nombre exacto de la cabecera: ignora mayúsculas, tildes
 *  y espacios. Así funciona aunque la cabecera sea "Fecha Alta", "fecha_alta"
 *  o "FECHA ALTA".
 */

const COLUMN_ALIASES: Record<keyof RawClientRow, string[]> = {
  idCliente: ['id cliente', 'id', 'idcliente', 'cliente id'],
  nombre: ['nombre', 'cliente', 'nombre cliente'],
  fechaAlta: ['fecha alta', 'alta', 'fecha de alta'],
  estado: ['estado', 'situacion'],
  fechaBaja: ['fecha baja', 'baja', 'fecha de baja'],
  motivoBaja: ['motivo baja', 'motivo de baja', 'motivo'],
  origen: ['origen', 'canal', 'fuente'],
};

function normalizeHeader(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function mapRowsToClients(matrix: string[][]): RawClientRow[] {
  if (matrix.length < 2) return [];

  const header = matrix[0].map(normalizeHeader);

  const indexOf = (field: keyof RawClientRow): number => {
    for (const alias of COLUMN_ALIASES[field]) {
      const i = header.indexOf(alias);
      if (i !== -1) return i;
    }
    return -1;
  };

  const cols = {
    idCliente: indexOf('idCliente'),
    nombre: indexOf('nombre'),
    fechaAlta: indexOf('fechaAlta'),
    estado: indexOf('estado'),
    fechaBaja: indexOf('fechaBaja'),
    motivoBaja: indexOf('motivoBaja'),
    origen: indexOf('origen'),
  };

  const value = (cells: string[], index: number): string =>
    index >= 0 && index < cells.length ? cells[index].trim() : '';

  return matrix
    .slice(1)
    .filter((cells) => value(cells, cols.idCliente) !== '')
    .map((cells) => ({
      idCliente: value(cells, cols.idCliente),
      nombre: value(cells, cols.nombre),
      fechaAlta: value(cells, cols.fechaAlta),
      estado: value(cells, cols.estado),
      fechaBaja: value(cells, cols.fechaBaja),
      motivoBaja: value(cells, cols.motivoBaja),
      origen: value(cells, cols.origen),
    }));
}
