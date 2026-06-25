import { useEffect, useMemo, useState } from 'react';
import type { MonthData } from '../types';
import { parseClients } from '../lib/clients';
import { computeMonthlyData } from '../lib/aggregate';
import { fetchClients, getDataSource, type DataSource } from '../lib/googleSheets';

interface ClinicDataState {
  months: MonthData[];
  loading: boolean;
  error: string | null;
  dataSource: DataSource;
  /** Fecha en la que se cargaron los datos (para "Actualizado…"). */
  lastUpdated: Date | null;
}

/**
 * Carga el CRM (demo o Google Sheets), normaliza los clientes y calcula
 * los KPIs mes a mes. Devuelve el estado listo para el dashboard.
 */
export function useClinicData(): ClinicDataState {
  const [rawCount, setRawCount] = useState(0); // solo para forzar el recálculo
  const [months, setMonths] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const dataSource = useMemo(() => getDataSource(), [rawCount]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchClients()
      .then((rows) => {
        if (cancelled) return;
        const clients = parseClients(rows);
        setMonths(computeMonthlyData(clients));
        setLastUpdated(new Date());
        setRawCount(rows.length);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError('No se pudieron cargar los datos del CRM.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { months, loading, error, dataSource, lastUpdated };
}
