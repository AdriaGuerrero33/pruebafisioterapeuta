import type { MonthData } from '../types';
import { formatNumber } from './format';

/**
 * Genera el texto del "Resumen inteligente del mes".
 *
 * Es un resumen automático basado en reglas (no llama a ningún servicio
 * externo, así la demo funciona sin claves de API). Combina los KPIs del mes,
 * la comparativa con el mes anterior, los motivos de baja principales y una
 * recomendación accionable según el motivo de baja más frecuente.
 *
 * El día que se quiera, esta función se puede sustituir por una llamada a un
 * modelo de lenguaje pasándole los mismos datos (`current` y `previous`).
 */
export function generateMonthlySummary(
  current: MonthData,
  previous: MonthData | null,
): string {
  const partes: string[] = [];

  // 1) Titular con los KPIs del mes.
  partes.push(
    `En ${current.monthLabel} la clínica registró ${formatNumber(current.clientesNuevos)} ` +
      `${plural(current.clientesNuevos, 'cliente nuevo', 'clientes nuevos')}, ` +
      `${formatNumber(current.clientesActivos)} ` +
      `${plural(current.clientesActivos, 'cliente activo', 'clientes activos')} y ` +
      `${formatNumber(current.bajas)} ${plural(current.bajas, 'baja', 'bajas')}.`,
  );

  // 2) Tendencia frente al mes anterior.
  if (previous) {
    const fragmentos: string[] = [];

    const activosDiff = current.clientesActivos - previous.clientesActivos;
    if (activosDiff !== 0) {
      fragmentos.push(
        `la base de clientes activos ${activosDiff > 0 ? 'creció' : 'se redujo'} ` +
          `${tendenciaPct(activosDiff, previous.clientesActivos)} respecto a ${previous.label}`,
      );
    } else {
      fragmentos.push(`los clientes activos se mantuvieron estables respecto a ${previous.label}`);
    }

    const bajasDiff = current.bajas - previous.bajas;
    if (bajasDiff > 0) {
      fragmentos.push(
        `las bajas aumentaron de ${formatNumber(previous.bajas)} a ${formatNumber(current.bajas)}`,
      );
    } else if (bajasDiff < 0) {
      fragmentos.push(
        `las bajas bajaron de ${formatNumber(previous.bajas)} a ${formatNumber(current.bajas)}`,
      );
    }

    partes.push(`${capitalizar(unirFrases(fragmentos))}.`);
  }

  // 3) Motivos de baja principales + recomendación.
  if (current.bajas === 0 || current.motivosBaja.length === 0) {
    partes.push(
      'No se registraron bajas este mes: es un buen momento para reforzar la captación ' +
        'y consolidar la fidelización de los pacientes actuales.',
    );
  } else {
    const top1 = current.motivosBaja[0];
    const top2 = current.motivosBaja[1];

    let motivosTexto =
      `El principal motivo de baja fue ${top1.motivo.toLowerCase()}, con ` +
      `${formatNumber(top1.cantidad)} ${plural(top1.cantidad, 'caso', 'casos')}`;
    if (top2) {
      motivosTexto +=
        `, seguido de ${top2.motivo.toLowerCase()} con ` +
        `${formatNumber(top2.cantidad)} ${plural(top2.cantidad, 'caso', 'casos')}`;
    }
    motivosTexto += '.';
    partes.push(motivosTexto);

    partes.push(recomendacionPorMotivo(top1.motivo));
  }

  return partes.join(' ');
}

/* ------------------------------------------------------------------ *
 *  Recomendaciones según el motivo de baja principal
 * ------------------------------------------------------------------ */

function recomendacionPorMotivo(motivo: string): string {
  const clave = normalizar(motivo);

  const recomendaciones: Record<string, string> = {
    'fin de tratamiento':
      'La clínica debería valorar planes de continuidad o mantenimiento tras el alta ' +
      '(revisiones periódicas, sesiones de prevención) para prolongar la relación con el paciente.',
    precio:
      'Conviene revisar la política de precios: bonos de sesiones, planes mensuales o ' +
      'descuentos por fidelidad pueden suavizar el impacto económico y retener pacientes.',
    'falta de tiempo':
      'Ofrecer horarios más flexibles, sesiones más cortas o seguimiento en remoto ayudaría ' +
      'a adaptarse a la agenda de los pacientes que abandonan por falta de tiempo.',
    'no obtuvo resultados':
      'Es recomendable reforzar el seguimiento clínico y comunicar mejor los objetivos y ' +
      'la evolución, para que el paciente perciba su progreso a lo largo del tratamiento.',
    'no vio resultados':
      'Es recomendable reforzar el seguimiento clínico y comunicar mejor los objetivos y ' +
      'la evolución, para que el paciente perciba su progreso a lo largo del tratamiento.',
    'cambio de ciudad':
      'Este motivo es difícil de evitar; aun así, ofrecer teleconsulta o un plan de ejercicios ' +
      'pautado puede mantener el vínculo e impulsar recomendaciones a la clínica.',
    descuentos:
      'Conviene comunicar mejor el valor diferencial de la clínica y valorar ofertas puntuales ' +
      'para no perder pacientes frente a la competencia por motivos de precio.',
  };

  return (
    recomendaciones[clave] ??
    'Conviene analizar este motivo con el equipo para diseñar acciones de retención específicas.'
  );
}

/* ------------------------------------------------------------------ *
 *  Utilidades de texto
 * ------------------------------------------------------------------ */

function plural(n: number, singular: string, plural: string): string {
  return Math.abs(n) === 1 ? singular : plural;
}

function tendenciaPct(diff: number, base: number): string {
  if (base === 0) return `en ${formatNumber(Math.abs(diff))}`;
  const pct = Math.round((Math.abs(diff) / base) * 100);
  return `un ${pct} %`;
}

function unirFrases(fragmentos: string[]): string {
  if (fragmentos.length === 0) return '';
  if (fragmentos.length === 1) return fragmentos[0];
  return `${fragmentos.slice(0, -1).join(', ')} y ${fragmentos[fragmentos.length - 1]}`;
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // elimina tildes y diacríticos
    .trim()
    .toLowerCase();
}
