import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { KpiDelta } from '../types';
import { Card } from './ui/Card';
import { formatNumber, formatPercent, formatSignedDiff } from '../lib/format';

type Accent = 'brand' | 'teal' | 'rose' | 'amber';

interface KpiCardProps {
  title: string;
  value: number;
  delta: KpiDelta;
  icon: ReactNode;
  accent: Accent;
  /** true: subir es bueno (verde). false: subir es malo, p.ej. bajas (rojo). */
  positiveIsGood: boolean;
  /** Etiqueta del mes anterior, p.ej. "Abril". */
  comparisonLabel?: string;
  /** Nota aclaratoria opcional bajo el valor. */
  hint?: string;
}

const ACCENT_BADGE: Record<Accent, string> = {
  brand: 'bg-brand-50 text-brand-600',
  teal: 'bg-teal-50 text-teal-600',
  rose: 'bg-rose-50 text-rose-500',
  amber: 'bg-amber-50 text-amber-600',
};

export function KpiCard({
  title,
  value,
  delta,
  icon,
  accent,
  positiveIsGood,
  comparisonLabel,
  hint,
}: KpiCardProps) {
  return (
    <Card className="p-5 transition hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${ACCENT_BADGE[accent]}`}
        >
          {icon}
        </span>
        <DeltaPill delta={delta} positiveIsGood={positiveIsGood} />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {formatNumber(value)}
      </p>

      <p className="mt-1.5 text-xs text-slate-400">
        {delta.hasPrevious
          ? `${formatSignedDiff(delta.diff)} frente a ${comparisonLabel ?? 'el mes anterior'}`
          : hint ?? 'Sin mes anterior para comparar'}
      </p>
    </Card>
  );
}

function DeltaPill({ delta, positiveIsGood }: { delta: KpiDelta; positiveIsGood: boolean }) {
  if (!delta.hasPrevious) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-400">
        <Minus className="h-3.5 w-3.5" />
        Nuevo
      </span>
    );
  }

  if (delta.direction === 'flat') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
        <Minus className="h-3.5 w-3.5" />
        0 %
      </span>
    );
  }

  const isGood =
    (delta.direction === 'up' && positiveIsGood) ||
    (delta.direction === 'down' && !positiveIsGood);

  const Icon = delta.direction === 'up' ? ArrowUpRight : ArrowDownRight;
  const tone = isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {formatPercent(delta.pct)}
    </span>
  );
}
