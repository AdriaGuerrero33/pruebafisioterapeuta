import { useMemo, useState } from 'react';
import { TrendingUp, UserMinus, UserPlus, Users } from 'lucide-react';
import type { MonthSelection } from '../types';
import { useClinicData } from '../hooks/useClinicData';
import {
  buildDelta,
  getPreviousMonth,
  resolveSelectedMonth,
} from '../lib/aggregate';
import { Topbar } from './Topbar';
import { AiSummaryCard } from './AiSummaryCard';
import { KpiCard } from './KpiCard';
import { EvolutionChart } from './EvolutionChart';
import { DropoutReasons } from './DropoutReasons';
import { OriginBreakdown } from './OriginBreakdown';

interface DashboardProps {
  onOpenSidebar: () => void;
}

export function Dashboard({ onOpenSidebar }: DashboardProps) {
  const { months, loading, error, lastUpdated } = useClinicData();
  const [selection, setSelection] = useState<MonthSelection>('auto');

  const current = useMemo(() => resolveSelectedMonth(months, selection), [months, selection]);
  const previous = useMemo(
    () => (current ? getPreviousMonth(months, current) : null),
    [months, current],
  );

  return (
    <>
      <Topbar
        selection={selection}
        onSelectionChange={setSelection}
        months={months}
        resolvedMonth={current}
        lastUpdated={lastUpdated}
        onOpenSidebar={onOpenSidebar}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <MessageState title="No se pudieron cargar los datos" detail={error} />
        ) : !current ? (
          <MessageState
            title="Sin datos para este mes"
            detail="Selecciona otro mes o conecta tu Google Sheet con datos."
          />
        ) : (
          <div className="animate-fade-in space-y-5">
            {/* 1. Resumen inteligente */}
            <AiSummaryCard current={current} previous={previous} />

            {/* 2. KPIs principales */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Clientes nuevos"
                value={current.clientesNuevos}
                delta={buildDelta(current.clientesNuevos, previous?.clientesNuevos ?? null)}
                comparisonLabel={previous?.label}
                icon={<UserPlus className="h-5 w-5" />}
                accent="brand"
                positiveIsGood
              />
              <KpiCard
                title="Clientes activos"
                value={current.clientesActivos}
                delta={buildDelta(current.clientesActivos, previous?.clientesActivos ?? null)}
                comparisonLabel={previous?.label}
                icon={<Users className="h-5 w-5" />}
                accent="teal"
                positiveIsGood
                hint="Pacientes con tratamiento activo este mes"
              />
              <KpiCard
                title="Bajas"
                value={current.bajas}
                delta={buildDelta(current.bajas, previous?.bajas ?? null)}
                comparisonLabel={previous?.label}
                icon={<UserMinus className="h-5 w-5" />}
                accent="rose"
                positiveIsGood={false}
              />
              <KpiCard
                title="Crecimiento neto"
                value={current.crecimientoNeto}
                delta={buildDelta(current.crecimientoNeto, previous?.crecimientoNeto ?? null)}
                comparisonLabel={previous?.label}
                icon={<TrendingUp className="h-5 w-5" />}
                accent="amber"
                positiveIsGood
                hint="Altas menos bajas del mes"
              />
            </div>

            {/* 3. Evolución mensual */}
            <EvolutionChart months={months} selectedMonth={current} />

            {/* 4. Motivos de baja + origen de captación */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <DropoutReasons month={current} />
              </div>
              <div className="lg:col-span-5">
                <OriginBreakdown month={current} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  Estados auxiliares
 * ------------------------------------------------------------------ */

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200/60" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-slate-200/60" />
    </div>
  );
}

function MessageState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{detail}</p>
    </div>
  );
}
