import type { RawClientRow } from '../types';

/**
 * Datos de DEMO que reproducen exactamente el CRM real de la clínica.
 *
 * Es el mismo formato que devuelve Google Sheets: una fila por cliente con
 * las columnas  ID Cliente | Nombre | Fecha Alta | Estado | Fecha Baja |
 * Motivo Baja | Origen.  Las fechas van en DD/MM/AAAA igual que en la hoja.
 *
 * Cuando se conecta el Google Sheet real (ver src/lib/googleSheets.ts) estos
 * datos se sustituyen automáticamente por los de la hoja, sin tocar nada más:
 * el resto del dashboard sigue funcionando igual porque los KPIs se calculan
 * a partir de estas filas.
 */
export const mockClients: RawClientRow[] = [
  { idCliente: 'CL001', nombre: 'Juan Pérez',       fechaAlta: '05/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL002', nombre: 'Marta García',     fechaAlta: '08/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL003', nombre: 'Carlos López',     fechaAlta: '10/01/2026', estado: 'Baja',   fechaBaja: '15/03/2026', motivoBaja: 'Precio',               origen: 'Google Ads' },
  { idCliente: 'CL004', nombre: 'Laura Sánchez',    fechaAlta: '12/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL005', nombre: 'David Martín',     fechaAlta: '15/01/2026', estado: 'Baja',   fechaBaja: '10/04/2026', motivoBaja: 'Fin de tratamiento',   origen: 'Google Ads' },
  { idCliente: 'CL006', nombre: 'Ana Ruiz',         fechaAlta: '18/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL007', nombre: 'Sergio Moreno',    fechaAlta: '20/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL008', nombre: 'Paula Torres',     fechaAlta: '22/01/2026', estado: 'Baja',   fechaBaja: '02/05/2026', motivoBaja: 'Falta de tiempo',      origen: 'Referido'   },
  { idCliente: 'CL009', nombre: 'Javier Díaz',      fechaAlta: '24/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL010', nombre: 'Lucía Romero',     fechaAlta: '25/01/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL011', nombre: 'Alberto Navarro',  fechaAlta: '01/02/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL012', nombre: 'Elena Gil',        fechaAlta: '03/02/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL013', nombre: 'Raúl Vega',        fechaAlta: '04/02/2026', estado: 'Baja',   fechaBaja: '20/04/2026', motivoBaja: 'Precio',               origen: 'Google Ads' },
  { idCliente: 'CL014', nombre: 'Sara Molina',      fechaAlta: '05/02/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL015', nombre: 'Rubén Castro',     fechaAlta: '06/02/2026', estado: 'Nuevo',  fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL016', nombre: 'Patricia León',    fechaAlta: '08/02/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL017', nombre: 'Miguel Ortega',    fechaAlta: '10/02/2026', estado: 'Baja',   fechaBaja: '10/05/2026', motivoBaja: 'No obtuvo resultados', origen: 'Google Ads' },
  { idCliente: 'CL018', nombre: 'Cristina Peña',    fechaAlta: '12/02/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL019', nombre: 'Álvaro Herrera',   fechaAlta: '15/02/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL020', nombre: 'Noelia Vidal',     fechaAlta: '18/02/2026', estado: 'Nuevo',  fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL021', nombre: 'Daniel Soto',      fechaAlta: '01/03/2026', estado: 'Nuevo',  fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL022', nombre: 'Irene Ramos',      fechaAlta: '03/03/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL023', nombre: 'Hugo Ferrer',      fechaAlta: '05/03/2026', estado: 'Baja',   fechaBaja: '18/05/2026', motivoBaja: 'Cambio de ciudad',     origen: 'Referido'   },
  { idCliente: 'CL024', nombre: 'Alicia Campos',    fechaAlta: '07/03/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL025', nombre: 'Marcos Prieto',    fechaAlta: '10/03/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL026', nombre: 'Verónica Núñez',   fechaAlta: '12/03/2026', estado: 'Nuevo',  fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL027', nombre: 'Pablo Cano',       fechaAlta: '15/03/2026', estado: 'Baja',   fechaBaja: '21/05/2026', motivoBaja: 'Precio',               origen: 'Referido'   },
  { idCliente: 'CL028', nombre: 'Andrea Soler',     fechaAlta: '18/03/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL029', nombre: 'Gonzalo Rubio',    fechaAlta: '20/03/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL030', nombre: 'Beatriz Iglesias', fechaAlta: '22/03/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL031', nombre: 'Víctor Fuentes',   fechaAlta: '01/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL032', nombre: 'Natalia Pardo',    fechaAlta: '02/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL033', nombre: 'Óscar Serrano',    fechaAlta: '05/04/2026', estado: 'Baja',   fechaBaja: '25/05/2026', motivoBaja: 'Fin de tratamiento',   origen: 'Google Ads' },
  { idCliente: 'CL034', nombre: 'Silvia Rey',       fechaAlta: '07/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL035', nombre: 'Adrián Vidal',     fechaAlta: '08/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL036', nombre: 'Nuria Lozano',     fechaAlta: '10/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL037', nombre: 'Jorge Muñoz',      fechaAlta: '12/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL038', nombre: 'Ainhoa Gil',       fechaAlta: '14/04/2026', estado: 'Baja',   fechaBaja: '28/05/2026', motivoBaja: 'Falta de tiempo',      origen: 'Instagram'  },
  { idCliente: 'CL039', nombre: 'Iván Delgado',     fechaAlta: '16/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL040', nombre: 'Claudia Esteban',  fechaAlta: '18/04/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL041', nombre: 'Mario Rivas',      fechaAlta: '01/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL042', nombre: 'Eva Calvo',        fechaAlta: '03/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL043', nombre: 'Samuel Pastor',    fechaAlta: '05/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL044', nombre: 'Lorena Arias',     fechaAlta: '06/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL045', nombre: 'Diego Molina',     fechaAlta: '08/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL046', nombre: 'Celia Navarro',    fechaAlta: '10/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL047', nombre: 'Ángel Romero',     fechaAlta: '12/05/2026', estado: 'Nuevo',  fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
  { idCliente: 'CL048', nombre: 'Mónica Pérez',     fechaAlta: '14/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Instagram'  },
  { idCliente: 'CL049', nombre: 'Fernando León',    fechaAlta: '16/05/2026', estado: 'Nuevo',  fechaBaja: '',           motivoBaja: '',                     origen: 'Google Ads' },
  { idCliente: 'CL050', nombre: 'Rocío Vega',       fechaAlta: '18/05/2026', estado: 'Activo', fechaBaja: '',           motivoBaja: '',                     origen: 'Referido'   },
];
