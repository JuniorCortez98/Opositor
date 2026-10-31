/* =========================================================
   Capa de datos · Temario oficial AGE (BOE)
   ---------------------------------------------------------
   Esquema de un TEMA:
     id          -> 'B1T1'
     bloque      -> 1..5
     numero      -> 1..N
     titulo      -> string
     normativa   -> string[]  (normas de cabecera del tema)
     resumen     -> string (Markdown)  -> /estudiar
     esquema     -> string (Markdown)  -> /esquema
     infografia  -> { mermaid, descripcion, promptImagen } -> /infografia
     preguntas   -> [ { pregunta, opciones[4], correcta(0-3), explicacion, referencia } ] -> /test
   ========================================================= */

import { bloque1 } from './bloque1.js';
import { bloque2 } from './bloque2.js';
import { bloque3 } from './bloque3.js';
import { bloque4 } from './bloque4.js';
import { bloque5 } from './bloque5.js';
import { conceptos } from './conceptos.js';

/** Metadatos de los 5 bloques oficiales. */
export const BLOQUES = [
  { n: 1, roman: 'I',   titulo: 'Organización del Estado y de la Administración Pública' },
  { n: 2, roman: 'II',  titulo: 'Organización de Oficinas Públicas' },
  { n: 3, roman: 'III', titulo: 'Derecho Administrativo General' },
  { n: 4, roman: 'IV',  titulo: 'Gestión de Personal' },
  { n: 5, roman: 'V',   titulo: 'Gestión Financiera' },
];

export const TEMAS = [
  ...bloque1,
  ...bloque2,
  ...bloque3,
  ...bloque4,
  ...bloque5,
];

/** Infografías transversales solicitables por nombre de procedimiento. */
export const CONCEPTOS = conceptos;

const ROMANOS = { I: 1, II: 2, III: 3, IV: 4, V: 5, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 };

export const getTema = (id) => TEMAS.find((t) => t.id === id) || null;

export const temasDeBloque = (n) => TEMAS.filter((t) => t.bloque === Number(n));

export const bloqueInfo = (n) => BLOQUES.find((b) => b.n === Number(n)) || null;

/**
 * Resuelve una referencia escrita por el opositor a un tema del temario.
 * Acepta: 'Bloque I - Tema 1', 'Bloque 1 tema 3', 'B1T1', 'bloque III-2'.
 * @returns {object|null}
 */
export function resolverTema(texto) {
  if (!texto) return null;
  const s = String(texto).trim();

  // Formato compacto: B1T1 / b3t2
  const compacto = s.match(/\bb\s*([1-5])\s*t\s*(\d{1,2})\b/i);
  if (compacto) return getTema(`B${compacto[1]}T${compacto[2]}`);

  // Formato 'Bloque X ... Tema Y'
  const bloq = s.match(/bloque\s*([IVX]+|\d)/i);
  const tema = s.match(/tema\s*(\d{1,2})/i);
  if (bloq && tema) {
    const b = ROMANOS[bloq[1].toUpperCase()] ?? Number(bloq[1]);
    return getTema(`B${b}T${Number(tema[1])}`);
  }
  return null;
}

/** Busca una infografía por concepto libre (p. ej. 'fases del gasto', 'D-OK-P'). */
export function resolverConcepto(texto) {
  if (!texto) return null;
  const q = String(texto).toLowerCase();
  return (
    CONCEPTOS.find((c) => c.claves.some((k) => q.includes(k))) || null
  );
}
