/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" para datos de demo, "sheets" para leer de Google Sheets */
  readonly VITE_DATA_SOURCE?: 'mock' | 'sheets';
  /** ID de la hoja de Google (parte de la URL entre /d/ y /edit) */
  readonly VITE_GOOGLE_SHEET_ID?: string;
  /** Nombre de la pestaña del CRM dentro de la hoja */
  readonly VITE_GOOGLE_SHEET_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
