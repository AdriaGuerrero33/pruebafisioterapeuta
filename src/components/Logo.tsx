interface LogoProps {
  /** "horizontal" = símbolo + texto (cabecera); "mark" = solo el símbolo. */
  variant?: 'horizontal' | 'mark';
  className?: string;
  /** Tamaño del símbolo en píxeles. */
  size?: number;
}

/**
 * Logo de la clínica recreado como SVG vectorial (nítido a cualquier tamaño,
 * sin depender de una imagen). Reproduce el aro y la columna vertebral en
 * verde azulado y la figura en movimiento sobre la mano, en azul.
 *
 * ¿Quieres usar tu PNG/SVG original en lugar de esta versión? Coloca el
 * archivo en  public/logo.png  y sustituye <LogoSymbol/> por:
 *     <img src="/logo.png" alt="Fisioterapia" width={size} height={size} />
 */
export function Logo({ variant = 'horizontal', className = '', size = 40 }: LogoProps) {
  if (variant === 'mark') {
    return <LogoSymbol size={size} className={className} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoSymbol size={size} />
      <div className="leading-none">
        <div className="text-[1.05rem] font-extrabold tracking-[0.14em] text-brand-800">
          FISIOTERAPIA
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="h-px w-3 bg-teal-400/70" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-teal-600">
            Cuidamos tu movimiento
          </span>
          <span className="h-px w-3 bg-teal-400/70" />
        </div>
      </div>
    </div>
  );
}

function LogoSymbol({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo Fisioterapia"
    >
      {/* Aro abierto (verde azulado) */}
      <path
        d="M45 12 A24 24 0 1 0 45 52"
        fill="none"
        stroke="#159b8e"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      {/* Columna vertebral de puntos */}
      <circle cx="29" cy="17" r="1.9" fill="#159b8e" />
      <circle cx="27.6" cy="22.5" r="2.3" fill="#159b8e" />
      <circle cx="27.3" cy="28" r="2.7" fill="#159b8e" />
      <circle cx="28.2" cy="33.5" r="2.5" fill="#159b8e" />
      <circle cx="30" cy="38.6" r="2.1" fill="#159b8e" />
      <circle cx="32" cy="43" r="1.7" fill="#159b8e" />
      {/* Figura en movimiento (azul) */}
      <circle cx="42" cy="15" r="5" fill="#1e5aa8" />
      <path
        d="M55 11 C 49 14, 44 18, 42 24 C 40 31, 39 35, 38 41 C 37 46, 38 50, 43 53"
        fill="none"
        stroke="#1e5aa8"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 26 C 36 29, 32 34, 30 40"
        fill="none"
        stroke="#1e5aa8"
        strokeWidth={3.8}
        strokeLinecap="round"
      />
      {/* Mano que sostiene */}
      <path d="M27 45 C 31 53, 45 54, 53 47 C 47 51, 35 52, 31 44 Z" fill="#1e5aa8" />
    </svg>
  );
}
