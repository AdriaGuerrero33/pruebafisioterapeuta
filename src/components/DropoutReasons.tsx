import { ListChecks, PartyPopper } from 'lucide-react';
import type { MonthData } from '../types';
import { Card, CardHeader } from './ui/Card';
import { formatNumber } from '../lib/format';

interface DropoutReasonsProps {
  month: MonthData;
}

/**
 * Tabla de motivos de baja al estilo Google Search Console: cada fila tiene el
 * motivo, su recuento, el porcentaje sobre el total y una barra proporcional.
 */
export function DropoutReasons({ month }: DropoutReasonsProps) {
  const total = month.bajas;
  const max = month.motivosBaja.reduce((m, r) => Math.max(m, r.cantidad), 0);

  return (
    <Card className="h-full">
      <CardHeader
        title="Motivos principales de baja"
        subtitle={`${month.monthLabel} · ${formatNumber(total)} ${total === 1 ? 'baja' : 'bajas'}`}
        icon={<ListChecks className="h-5 w-5" strokeWidth={2} />}
      />

      <div className="px-5 pb-6 pt-4 sm:px-6">
        {month.motivosBaja.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400">
              <span>Motivo</span>
              <span>Bajas · %</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {month.motivosBaja.map((reason) => {
                const pctOfTotal = total > 0 ? Math.round((reason.cantidad / total) * 100) : 0;
                const pctOfMax = max > 0 ? (reason.cantidad / max) * 100 : 0;
                return (
                  <li key={reason.motivo} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-700">{reason.motivo}</span>
                      <span className="flex shrink-0 items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {formatNumber(reason.cantidad)}
                        </span>
                        <span className="w-9 text-right text-xs tabular-nums text-slate-400">
                          {pctOfTotal} %
                        </span>
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
                        style={{ width: `${pctOfMax}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <PartyPopper className="h-6 w-6" />
      </span>
      <p className="text-sm font-medium text-slate-700">Sin bajas este mes</p>
      <p className="max-w-xs text-xs text-slate-400">
        No se registró ninguna baja. Buen momento para reforzar la fidelización.
      </p>
    </div>
  );
}
