import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Radar } from 'lucide-react';
import type { MonthData } from '../types';
import { Card, CardHeader } from './ui/Card';
import { formatNumber } from '../lib/format';

interface OriginBreakdownProps {
  month: MonthData;
}

const ORIGIN_COLORS: Record<string, string> = {
  'Google Ads': '#2f70bd',
  Instagram: '#159b8e',
  Referido: '#e0a83e',
};

const FALLBACK_COLORS = ['#2f70bd', '#159b8e', '#e0a83e', '#7c8aa5', '#9333ea', '#0ea5e9'];

function colorFor(origen: string, index: number): string {
  return ORIGIN_COLORS[origen] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

/** Distribución por canal de captación de los clientes nuevos del mes. */
export function OriginBreakdown({ month }: OriginBreakdownProps) {
  const total = month.clientesNuevos;
  const data = month.origenNuevos;

  return (
    <Card className="h-full">
      <CardHeader
        title="Origen de los clientes nuevos"
        subtitle={`${month.monthLabel} · ${formatNumber(total)} altas`}
        icon={<Radar className="h-5 w-5" strokeWidth={2} />}
      />

      <div className="px-5 pb-6 pt-4 sm:px-6">
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No hubo altas nuevas este mes.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Donut */}
            <div className="relative h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="cantidad"
                    nameKey="origen"
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.origen} fill={colorFor(entry.origen, index)} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{formatNumber(total)}</span>
                <span className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
                  altas
                </span>
              </div>
            </div>

            {/* Leyenda */}
            <ul className="w-full flex-1 space-y-2.5">
              {data.map((entry, index) => {
                const pct = total > 0 ? Math.round((entry.cantidad / total) * 100) : 0;
                return (
                  <li key={entry.origen} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: colorFor(entry.origen, index) }}
                    />
                    <span className="flex-1 text-sm text-slate-600">{entry.origen}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatNumber(entry.cantidad)}
                    </span>
                    <span className="w-9 text-right text-xs tabular-nums text-slate-400">
                      {pct} %
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
