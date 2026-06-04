/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" para datos de demo, "sheets" para leer de Google Sheets */
  readonly VITE_DATA_SOURCE?: 'mock' | 'sheets';
  /** URL de "Publicar en la web" en formato CSV (método recomendado) */
  readonly VITE_GOOGLE_SHEET_CSV_URL?: string;
  /** ID de la hoja de Google (parte de la URL entre /d/ y /edit) */
  readonly VITE_GOOGLE_SHEET_ID?: string;
  /** Nombre de la pestaña del CRM (vacío = primera pestaña) */
  readonly VITE_GOOGLE_SHEET_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
