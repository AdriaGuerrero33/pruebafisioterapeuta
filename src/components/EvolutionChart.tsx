import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import type { MonthData } from '../types';
import { Card, CardHeader } from './ui/Card';
import { formatNumber } from '../lib/format';

interface EvolutionChartProps {
  months: MonthData[];
  selectedMonth: MonthData;
}

type SeriesKey = 'nuevos' | 'activos' | 'bajas';

interface SeriesConfig {
  key: SeriesKey;
  label: string;
  color: string;
  axis: 'left' | 'right';
}

const SERIES: SeriesConfig[] = [
  { key: 'nuevos', label: 'Clientes nuevos', color: '#2f70bd', axis: 'left' },
  { key: 'activos', label: 'Clientes activos', color: '#159b8e', axis: 'right' },
  { key: 'bajas', label: 'Bajas', color: '#f43f5e', axis: 'left' },
];

export function EvolutionChart({ months, selectedMonth }: EvolutionChartProps) {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    nuevos: true,
    activos: true,
    bajas: true,
  });

  const data = months.map((m) => ({
    name: m.shortLabel,
    monthLabel: m.monthLabel,
    nuevos: m.clientesNuevos,
    activos: m.clientesActivos,
    bajas: m.bajas,
  }));

  const selectedValue: Record<SeriesKey, number> = {
    nuevos: selectedMonth.clientesNuevos,
    activos: selectedMonth.clientesActivos,
    bajas: selectedMonth.bajas,
  };

  const showLeftAxis = visible.nuevos || visible.bajas;

  function toggle(key: SeriesKey) {
    setVisible((v) => ({ ...v, [key]: !v[key] }));
  }

  return (
    <Card>
      <CardHeader
        title="Evolución mensual"
        subtitle="Clientes nuevos, activos y bajas a lo largo del año"
        icon={<LineChartIcon className="h-5 w-5" strokeWidth={2} />}
      />

      {/* Toggles tipo Search Console */}
      <div className="mt-4 grid grid-cols-1 gap-2 px-5 sm:grid-cols-3 sm:px-6">
        {SERIES.map((s) => {
          const active = visible[s.key];
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                active
                  ? 'border-slate-200 bg-white shadow-sm'
                  : 'border-dashed border-slate-200 bg-slate-50/60 opacity-60'
              }`}
              style={active ? { borderBottomColor: s.color, borderBottomWidth: 3 } : undefined}
            >
              <span>
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: active ? s.color : '#cbd5e1' }}
                  />
                  {s.label}
                </span>
                <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900">
                  {formatNumber(selectedValue[s.key])}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Gráfico de líneas */}
      <div className="px-2 pb-4 pt-5 sm:px-4">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={<MonthTick selected={selectedMonth.shortLabel} />}
              height={36}
            />
            {showLeftAxis && (
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={36}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
            )}
            {visible.activos && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={40}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
            )}
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine
              x={selectedMonth.shortLabel}
              yAxisId={showLeftAxis ? 'left' : 'right'}
              stroke="#cbd5e1"
              strokeDasharray="4 4"
            />
            {SERIES.map((s) =>
              visible[s.key] ? (
                <Line
                  key={s.key}
                  yAxisId={s.axis === 'right' ? 'right' : showLeftAxis ? 'left' : 'right'}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 0, fill: s.color }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */

function MonthTick({ x, y, payload, selected }: any) {
  const isSelected = payload?.value === selected;
  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      fontSize={12}
      fontWeight={isSelected ? 700 : 500}
      fill={isSelected ? '#1e5aa8' : '#94a3b8'}
    >
      {payload?.value}
    </text>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const label = payload[0]?.payload?.monthLabel ?? '';

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card-hover">
      <p className="mb-1.5 text-xs font-semibold text-slate-700">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500">{entry.name}</span>
            <span className="ml-auto font-semibold text-slate-800">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
