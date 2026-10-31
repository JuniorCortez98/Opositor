/* Persistencia del progreso del opositor (localStorage) */

import { TEMAS, BLOQUES, temasDeBloque } from './data/index.js';

const KEY = 'opositor-age-v1';
let state = null;
const suscriptores = [];

const defaults = () => ({ temas: {}, historial: [], calendario: null, version: 1 });

function cargar() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    return Object.assign(defaults(), JSON.parse(raw));
  } catch (e) {
    console.warn('Progreso ilegible, se reinicia', e);
    return defaults();
  }
}

export function getState() {
  if (!state) state = cargar();
  return state;
}

function commit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar el progreso', e);
  }
  suscriptores.forEach((fn) => fn(state));
}

export function onChange(fn) {
  suscriptores.push(fn);
}

export function peek(id) {
  return getState().temas[id] || null;
}

export function tema(id) {
  const s = getState();
  if (!s.temas[id]) {
    s.temas[id] = {
      estudiado: false, esquema: false, infografia: false,
      test: { intentos: 0, aciertos: 0, total: 0 }, visto: null,
    };
  }
  return s.temas[id];
}

export function marcar(id, campo) {
  const t = tema(id);
  t[campo] = true;
  t.visto = Date.now();
  commit();
}

export function registrarTest(id, aciertos, total) {
  const t = tema(id);
  t.test.intentos += 1;
  t.test.aciertos += aciertos;
  t.test.total += total;
  t.visto = Date.now();
  getState().historial.push({ ts: Date.now(), tema: id, aciertos, total });
  commit();
}

export function setCalendario(cfg) {
  getState().calendario = cfg;
  commit();
}

export function getCalendario() {
  return getState().calendario;
}

export function reiniciar() {
  state = defaults();
  commit();
}

/* ---------------------------- métricas ---------------------------- */

export function cobertura() {
  const s = getState();
  const completados = TEMAS.filter((t) => s.temas[t.id] && s.temas[t.id].estudiado).length;
  return { completados, total: TEMAS.length, pct: Math.round((completados / TEMAS.length) * 100) };
}

export function statsBloque(n) {
  const s = getState();
  const temas = temasDeBloque(n);
  let completados = 0, aciertos = 0, total = 0, intentos = 0;
  temas.forEach((t) => {
    const r = s.temas[t.id];
    if (!r) return;
    if (r.estudiado) completados += 1;
    aciertos += r.test.aciertos;
    total += r.test.total;
    intentos += r.test.intentos;
  });
  return {
    n,
    temas: temas.length,
    completados,
    aciertos,
    total,
    intentos,
    pctTest: total ? Math.round((aciertos / total) * 100) : null,
    pctCobertura: Math.round((completados / temas.length) * 100),
  };
}

export function rankingErrores() {
  const s = getState();
  return TEMAS
    .map((t) => {
      const r = s.temas[t.id];
      if (!r || !r.test.total) return null;
      return {
        id: t.id, bloque: t.bloque, titulo: t.titulo,
        pct: Math.round((r.test.aciertos / r.test.total) * 100),
        total: r.test.total,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.pct - b.pct);
}

export function temasPendientes() {
  return TEMAS.filter((t) => !peek(t.id) || !peek(t.id).estudiado);
}

export function temasParaRepaso(limite = 6) {
  const s = getState();
  return TEMAS
    .filter((t) => s.temas[t.id] && s.temas[t.id].estudiado)
    .map((t) => ({ t, r: s.temas[t.id] }))
    .sort((a, b) => {
      const pa = a.r.test.total ? a.r.test.aciertos / a.r.test.total : 0;
      const pb = b.r.test.total ? b.r.test.aciertos / b.r.test.total : 0;
      if (pa !== pb) return pa - pb;
      return (a.r.visto || 0) - (b.r.visto || 0);
    })
    .slice(0, limite)
    .map((x) => x.t);
}

export function historialReciente(n = 10) {
  return getState().historial.slice(-n).reverse();
}

export function nombreBloque(n) {
  const b = BLOQUES.find((x) => x.n === Number(n));
  return b ? `Bloque ${b.roman}` : `Bloque ${n}`;
}

/** Cuadro de mando en texto Markdown (para copiar y compartir). */
export function resumenMarkdown() {
  const cob = cobertura();
  const lineas = [];
  lineas.push('# Cuadro de mando · Opositor AGE');
  lineas.push('');
  lineas.push(`> Cobertura del temario: **${cob.completados}/${cob.total} temas (${cob.pct}%)**`);
  lineas.push('');
  lineas.push('## Rendimiento por bloque');
  lineas.push('');
  lineas.push('| Bloque | Temas completados | Test | Aciertos | % Acierto |');
  lineas.push('|---|---|---|---|---|');
  BLOQUES.forEach((b) => {
    const s = statsBloque(b.n);
    lineas.push(`| ${nombreBloque(b.n)} · ${b.titulo} | ${s.completados}/${s.temas} | ${s.intentos} | ${s.aciertos}/${s.total} | ${s.pctTest == null ? '—' : s.pctTest + '%'} |`);
  });
  const rank = rankingErrores().slice(0, 5);
  lineas.push('');
  lineas.push('## Temas con mayor tasa de error');
  lineas.push('');
  if (!rank.length) {
    lineas.push('_Sin datos: todavía no se han realizado test._');
  } else {
    rank.forEach((r) => lineas.push(`- **${r.id}** · ${nombreBloque(r.bloque)} · ${r.titulo} — ${r.pct}% de acierto sobre ${r.total} preguntas`));
  }
  const pend = temasPendientes();
  lineas.push('');
  lineas.push('## Prioridades');
  lineas.push('');
  lineas.push(`- Temas pendientes de estudio: **${pend.length}**`);
  if (pend.length) lineas.push(`  - Siguientes: ${pend.slice(0, 5).map((t) => t.id).join(', ')}`);
  lineas.push(`- Temas estudiados a reforzar: ${temasParaRepaso(3).map((t) => t.id).join(', ') || '—'}`);
  lineas.push('');
  lineas.push(`_Actualizado: ${new Date().toLocaleString('es-ES')}_`);
  return lineas.join('\n');
}
