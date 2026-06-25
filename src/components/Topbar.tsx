import { Menu, RefreshCw } from 'lucide-react';
import type { MonthData, MonthSelection } from '../types';
import { MonthSelector } from './MonthSelector';

interface TopbarProps {
  selection: MonthSelection;
  onSelectionChange: (selection: MonthSelection) => void;
  months: MonthData[];
  resolvedMonth: MonthData | null;
  lastUpdated: Date | null;
  onOpenSidebar: () => void;
}

export function Topbar({
  selection,
  onSelectionChange,
  months,
  resolvedMonth,
  lastUpdated,
  onOpenSidebar,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Panel de control</h1>
            <p className="text-sm text-slate-500">Resumen mensual de la clínica</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
              <RefreshCw className="h-3.5 w-3.5" />
              Actualizado{' '}
              {lastUpdated.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}

          <MonthSelector
            selection={selection}
            onChange={onSelectionChange}
            months={months}
            resolvedMonth={resolvedMonth}
          />

          <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-teal-500 text-xs font-bold text-white">
              FT
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-700">Clínica</p>
              <p className="text-xs text-slate-400">Administración</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
