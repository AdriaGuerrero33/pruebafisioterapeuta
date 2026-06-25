import type { ComponentType } from 'react';
import {
  CalendarDays,
  FileBarChart2,
  LayoutDashboard,
  Settings,
  UserMinus,
  Users,
  X,
} from 'lucide-react';
import { Logo } from './Logo';
import { getDataSource } from '../lib/googleSheets';

interface NavItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Panel', active: true },
  { icon: Users, label: 'Pacientes' },
  { icon: CalendarDays, label: 'Sesiones' },
  { icon: UserMinus, label: 'Bajas' },
  { icon: FileBarChart2, label: 'Informes' },
  { icon: Settings, label: 'Ajustes' },
];

function SidebarContent() {
  const source = getDataSource();
  const isLive = source === 'sheets';

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-slate-100 px-5">
        <Logo size={36} />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
          Menú
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Icon className="h-[1.15rem] w-[1.15rem]" />
            <span>{label}</span>
            {!active && (
              <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-400">
                Pronto
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Estado de la fuente de datos */}
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
                  isLive ? 'animate-ping bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isLive ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {isLive ? 'Google Sheets · en vivo' : 'Datos de demostración'}
            </span>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-relaxed text-slate-400">
            {isLive
              ? 'Conectado a tu hoja de cálculo del CRM.'
              : 'Conecta tu Google Sheet desde el archivo .env (ver README).'}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Barra lateral fija en escritorio. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block md:sticky md:top-0 md:h-screen md:overflow-y-auto">
      <SidebarContent />
    </aside>
  );
}

/** Cajón lateral deslizante para móvil. */
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Fondo oscuro */}
      <div
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </div>
    </div>
  );
}
