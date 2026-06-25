import { Sparkles, TrendingUp, UserMinus, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MonthData } from '../types';
import { generateMonthlySummary } from '../lib/aiSummary';
import { formatSignedDiff } from '../lib/format';

interface AiSummaryCardProps {
  current: MonthData;
  previous: MonthData | null;
}

export function AiSummaryCard({ current, previous }: AiSummaryCardProps) {
  const summary = generateMonthlySummary(current, previous);
  const topReason = current.motivosBaja[0];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-teal-50/50 shadow-card">
      {/* Adorno difuminado de fondo */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-brand-200/30 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-teal-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-800">
                Resumen inteligente del mes
              </h2>
              <span className="rounded-full bg-brand-600/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-brand-700">
                IA
              </span>
            </div>
            <p className="text-sm text-slate-500">{current.monthLabel}</p>
          </div>
        </div>

        <p className="mt-4 max-w-4xl text-[0.95rem] leading-relaxed text-slate-700">
          {summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip icon={<Users className="h-3.5 w-3.5" />} tone="brand">
            {current.clientesActivos} clientes activos
          </Chip>
          <Chip icon={<TrendingUp className="h-3.5 w-3.5" />} tone="teal">
            Crecimiento neto {formatSignedDiff(current.crecimientoNeto)}
          </Chip>
          {topReason && (
            <Chip icon={<UserMinus className="h-3.5 w-3.5" />} tone="rose">
              Top baja: {topReason.motivo} ({topReason.cantidad})
            </Chip>
          )}
        </div>
      </div>
    </section>
  );
}

type ChipTone = 'brand' | 'teal' | 'rose';

const CHIP_TONE: Record<ChipTone, string> = {
  brand: 'bg-white/70 text-brand-700 ring-brand-100',
  teal: 'bg-white/70 text-teal-700 ring-teal-100',
  rose: 'bg-white/70 text-rose-600 ring-rose-100',
};

function Chip({ icon, tone, children }: { icon: ReactNode; tone: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${CHIP_TONE[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}
