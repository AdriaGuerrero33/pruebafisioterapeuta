import { useEffect, useRef, useState } from 'react';
import { Calendar, Check, ChevronDown, Sparkles } from 'lucide-react';
import type { MonthData, MonthSelection } from '../types';
import { MONTH_KEYS, MONTH_LABELS } from '../lib/months';

interface MonthSelectorProps {
  selection: MonthSelection;
  onChange: (selection: MonthSelection) => void;
  months: MonthData[];
  /** Mes resuelto actualmente (para mostrar la etiqueta del modo automático). */
  resolvedMonth: MonthData | null;
}

export function MonthSelector({ selection, onChange, months, resolvedMonth }: MonthSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const availableKeys = new Set(months.map((m) => m.key));

  // Cerrar al hacer clic fuera o pulsar Escape.
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isAuto = selection === 'auto';
  const buttonLabel = isAuto
    ? `Mes anterior${resolvedMonth ? ` · ${resolvedMonth.label}` : ''}`
    : MONTH_LABELS[selection] ?? 'Selecciona un mes';

  function select(value: MonthSelection) {
    onChange(value);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/40 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:w-auto"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Calendar className="h-4 w-4 text-brand-600" />
        <span className="whitespace-nowrap">{buttonLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-30 mt-2 w-64 origin-top-right animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-card-hover"
          role="listbox"
        >
          {/* Opción automática */}
          <button
            type="button"
            onClick={() => select('auto')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
              isAuto ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-teal-500" />
            <span className="flex-1">
              <span className="block font-semibold">Mes anterior (automático)</span>
              <span className="block text-xs text-slate-400">
                Último mes cerrado{resolvedMonth ? `: ${resolvedMonth.label}` : ''}
              </span>
            </span>
            {isAuto && <Check className="h-4 w-4 text-brand-600" />}
          </button>

          <div className="my-1.5 border-t border-slate-100" />

          {/* Meses concretos */}
          <div className="max-h-64 overflow-y-auto">
            {MONTH_KEYS.map((key) => {
              const hasData = availableKeys.has(key);
              const selected = !isAuto && selection === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!hasData}
                  onClick={() => select(key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    selected
                      ? 'bg-brand-50 font-semibold text-brand-700'
                      : hasData
                        ? 'text-slate-700 hover:bg-slate-50'
                        : 'cursor-not-allowed text-slate-300'
                  }`}
                >
                  <span>{MONTH_LABELS[key]}</span>
                  {selected ? (
                    <Check className="h-4 w-4 text-brand-600" />
                  ) : !hasData ? (
                    <span className="text-[0.65rem] uppercase tracking-wide text-slate-300">
                      Sin datos
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
