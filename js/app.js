/* =========================================================
   Opositor AGE · Aplicación principal
   Consola de comandos: /estudiar /esquema /infografia /test
                        /calendario /progreso /temario /ayuda
   ========================================================= */

import { BLOQUES, TEMAS, CONCEPTOS, temasDeBloque, bloqueInfo, resolverTema, resolverConcepto } from './data/index.js';
import { renderMarkdown, renderMermaid, esc, el } from './render.js';
import * as P from './progreso.js';
import { iniciarTest, mezclar } from './test.js';
import { renderCalendario } from './calendario.js';

const content = document.getElementById('content');
const nav = document.getElementById('temarioNav');
const form = document.getElementById('consoleForm');
const input = document.getElementById('cmdInput');

const ROMANOS = { I: 1, II: 2, III: 3, IV: 4, V: 5, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
const roman = (n) => (bloqueInfo(n) || {}).roman || n;
const refTema = (t) => `Bloque ${roman(t.bloque)} - Tema ${t.numero}`;
const URL_IMG = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image';

/* ------------------------------------------------------------------ */
/*  Utilidades de vista                                               */
/* ------------------------------------------------------------------ */

function pintar(nodo) {
  content.appendChild(nodo);
  requestAnimationFrame(() => nodo.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  return nodo;
}

function hayContenido() {
  return content.querySelector('.card') !== null;
}

function cabecera(tag, titulo, sub) {
  return `<div class="card-head">
    <span class="tag">${esc(tag)}</span>
    <div><h2>${esc(titulo)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>
  </div>`;
}

function noEncontrado(entrada) {
  return el(`<article class="card">
    ${cabecera('Error de comando', 'No he podido identificar el tema o concepto', `Entrada recibida: ${entrada || '(vacía)'}`)}
    <p>Usa el formato oficial del temario o el código abreviado. Ejemplos válidos:</p>
    <ul>
      <li><code>/estudiar Bloque I - Tema 1</code></li>
      <li><code>/esquema Bloque III - Tema 3</code></li>
      <li><code>/test B4T5 20</code></li>
      <li><code>/infografia fases del gasto</code></li>
    </ul>
    <p style="color:var(--text-faint);font-size:13px">Bloques disponibles: I (11 temas) · II (4 temas) · III (7 temas) · IV (9 temas) · V (6 temas).</p>
    <div class="actions">
      <button class="btn" data-cmd="/temario">Ver el temario completo</button>
      <button class="btn ghost" data-cmd="/ayuda">Comandos disponibles</button>
    </div>
  </article>`);
}

function acciones(t) {
  const r = P.peek(t.id);
  const hecho = r && r.estudiado;
  return `
    <button class="btn ${hecho ? '' : 'primary'}" data-cmd="#estudiado:${t.id}">
      ${hecho ? '✓ Tema completado' : 'Marcar como estudiado'}
    </button>
    <button class="btn" data-cmd="/esquema ${refTema(t)}">Esquema jerárquico</button>
    <button class="btn" data-cmd="/infografia ${refTema(t)}">Infografía técnica</button>
    <button class="btn" data-cmd="/test ${refTema(t)} 10">Test de 10 preguntas</button>`;
}

/* ------------------------------------------------------------------ */
/*  Comandos                                                          */
/* ------------------------------------------------------------------ */

function cmdEstudiar(ref) {
  const t = resolverTema(ref);
  if (!t) return pintar(noEncontrado(ref));
  marcarActivo(t.id);
  const nodo = el(`<article class="card">
    ${cabecera(`Bloque ${roman(t.bloque)} · Tema ${t.numero}`, t.titulo, 'Resumen normativo de alto rendimiento · foco en lo evaluado por el INAP')}
    <h3 class="section-title">Normativa de referencia</h3>
    <ul>${t.normativa.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    <div class="cuerpo"></div>
    <div class="actions">${acciones(t)}</div>
  </article>`);
  renderMarkdown(nodo.querySelector('.cuerpo'), t.resumen);
  pintar(nodo);
}

function cmdEsquema(ref) {
  const t = resolverTema(ref);
  if (!t) return pintar(noEncontrado(ref));
  marcarActivo(t.id);
  P.marcar(t.id, 'esquema');
  const nodo = el(`<article class="card">
    ${cabecera(`Bloque ${roman(t.bloque)} · Tema ${t.numero} · Esquema`, t.titulo, 'Estructura jerárquica en árbol para memorización activa')}
    <div class="cuerpo"></div>
    <div class="actions">${acciones(t)}</div>
  </article>`);
  renderMarkdown(nodo.querySelector('.cuerpo'), t.esquema);
  pintar(nodo);
}

function cmdInfografia(ref) {
  if (!ref) return pintar(listaConceptos());
  const t = resolverTema(ref);
  let datos = null;
  if (t) {
    marcarActivo(t.id);
    P.marcar(t.id, 'infografia');
    datos = { ...t.infografia, titulo: t.titulo, tag: `Bloque ${roman(t.bloque)} · Tema ${t.numero} · Infografía`, normativa: t.normativa.join(' · ') };
  } else {
    const c = resolverConcepto(ref);
    if (c) datos = { mermaid: c.mermaid, descripcion: c.descripcion, promptImagen: c.promptImagen, titulo: c.titulo, tag: 'Infografía transversal', normativa: c.normativa };
  }
  if (!datos) return pintar(noEncontrado(ref));

  const nodo = el(`<article class="card">
    ${cabecera(datos.tag, datos.titulo, 'Diagrama técnico Mermaid + propuesta de infografía visual')}
    <p style="color:var(--text-dim);font-size:13px"><strong>Base normativa:</strong> ${esc(datos.normativa)}</p>
    <div class="section-title">Diagrama de flujo</div>
    <div class="mermaid-wrap"><div class="mermaid">Cargando diagrama…</div></div>
    <div class="section-title">Descripción para la infografía visual</div>
    <p>${esc(datos.descripcion)}</p>
    <div class="section-title">Prompt optimizado para generación de imagen</div>
    <div class="prompt-box">${esc(datos.promptImagen)}</div>
    <div class="actions">
      <button class="btn primary" id="btnImg">Generar infografía visual</button>
      ${t ? `<button class="btn" data-cmd="/estudiar ${refTema(t)}">Ver resumen del tema</button>
             <button class="btn" data-cmd="/test ${refTema(t)} 10">Test del tema</button>` : ''}
    </div>
    <div id="imgWrap"></div>
  </article>`);

  renderMermaid(nodo.querySelector('.mermaid'), datos.mermaid);

  nodo.querySelector('#btnImg').addEventListener('click', (ev) => {
    const wrap = nodo.querySelector('#imgWrap');
    if (wrap.dataset.hecho) { wrap.innerHTML = ''; delete wrap.dataset.hecho; ev.target.textContent = 'Generar infografía visual'; return; }
    wrap.dataset.hecho = '1';
    ev.target.textContent = 'Ocultar infografía';
    wrap.innerHTML = `<div class="section-title">Infografía generada</div>
      <img alt="Infografía de estudio" loading="lazy" style="width:100%;border-radius:var(--radius-sm);border:1px solid var(--border)"
        src="${URL_IMG}?prompt=${encodeURIComponent(datos.promptImagen)}&image_size=landscape_16_9" />`;
  });

  pintar(nodo);
}

function listaConceptos() {
  return el(`<article class="card">
    ${cabecera('Infografías', 'Procedimientos disponibles', 'Invoca una infografía transversal indicando el concepto')}
    <ul>${CONCEPTOS.map((c) => `<li><strong>${esc(c.titulo)}</strong><br/><span style="color:var(--text-faint);font-size:12.5px">Prueba: <code>/infografia ${esc(c.claves[0])}</code></span></li>`).join('')}</ul>
  </article>`);
}

function poolDeTema(t, n) {
  let pool = t.preguntas.map((p, i) => ({ ...p, temaId: t.id, idx: i, temaTitulo: t.titulo }));
  if (n > pool.length) {
    const extra = temasDeBloque(t.bloque)
      .filter((x) => x.id !== t.id)
      .flatMap((x) => x.preguntas.map((p, i) => ({ ...p, temaId: x.id, idx: i, temaTitulo: x.titulo })));
    pool = pool.concat(mezclar(extra));
  }
  return pool;
}

function registrarDetalle(detalle) {
  const agg = {};
  detalle.forEach((d) => {
    if (!d.temaId) return;
    agg[d.temaId] = agg[d.temaId] || { a: 0, t: 0 };
    agg[d.temaId].t += 1;
    if (d.ok) agg[d.temaId].a += 1;
  });
  Object.entries(agg).forEach(([id, v]) => P.registrarTest(id, v.a, v.t));
}

function cmdTest(ref, n) {
  const t = resolverTema(ref);
  let pool = [];
  let etiqueta = '';
  let contexto = null;

  if (t) {
    marcarActivo(t.id);
    contexto = t;
    pool = poolDeTema(t, n || 10);
    etiqueta = `Bloque ${roman(t.bloque)} · Tema ${t.numero}`;
  } else {
    const b = resolverBloque(ref);
    if (b != null) {
      pool = temasDeBloque(b).flatMap((x) => x.preguntas.map((p, i) => ({ ...p, temaId: x.id, idx: i, temaTitulo: x.titulo })));
      const info = bloqueInfo(b);
      etiqueta = `Bloque ${info.roman} · simulacro completo`;
    }
  }

  if (!pool.length) return pintar(noEncontrado(ref));

  const total = Math.max(1, Math.min(n || 10, pool.length, 100));
  const nodo = el(`<article class="card">
    ${cabecera(etiqueta, t ? t.titulo : `Test de bloque · ${total} preguntas`, `Cuestionario tipo examen oficial INAP · ${total} preguntas con 4 opciones`)}
    <div id="testBody"></div>
  </article>`);
  pintar(nodo);
  const body = nodo.querySelector('#testBody');

  const lanzar = () => {
    const sel = mezclar(pool).slice(0, total);
    iniciarTest(body, sel, {
      onRepetir: lanzar,
      onResumen: t ? () => cmdEstudiar(refTema(t)) : null,
    }, (r) => registrarDetalle(r.detalle));
  };
  lanzar();
}

function cmdCalendario() {
  const nodo = el('<article class="card"></article>');
  renderCalendario(nodo);
  pintar(nodo);
}

function cmdProgreso() {
  const cob = P.cobertura();
  const rank = P.rankingErrores();
  const his = P.historialReciente(8);
  const fortalezas = BLOQUES.map((b) => ({ b, s: P.statsBloque(b.n) })).filter((x) => x.s.pctTest != null && x.s.pctTest >= 75);
  const md = P.resumenMarkdown();

  const nodo = el(`<article class="card">
    ${cabecera('Cuadro de mando', 'Progreso del opositor', 'Seguimiento persistente: cobertura, aciertos y prioridades')}

    <div class="grid-2" style="gap:12px">
      <div class="stat"><div class="k">Cobertura del temario</div><div class="v">${cob.pct}% <small>${cob.completados}/${cob.total} temas</small></div></div>
      <div class="stat"><div class="k">Test realizados</div><div class="v">${P.getState().historial.length}</div></div>
      <div class="stat"><div class="k">Preguntas contestadas</div><div class="v">${P.getState().historial.reduce((s, h) => s + h.total, 0)}</div></div>
      <div class="stat"><div class="k">Acierto global</div><div class="v">${(() => { const h = P.getState().historial; const t = h.reduce((s, x) => s + x.total, 0); const a = h.reduce((s, x) => s + x.aciertos, 0); return t ? Math.round((a / t) * 100) + '%' : '—'; })()}</div></div>
    </div>

    <div class="section-title">Rendimiento por bloque</div>
    <table class="data">
      <thead><tr><th>Bloque</th><th>Cobertura</th><th>Test</th><th>Aciertos</th><th>% Acierto</th></tr></thead>
      <tbody>
        ${BLOQUES.map((b) => {
          const s = P.statsBloque(b.n);
          const pct = s.pctTest;
          const cls = pct == null ? '' : pct >= 75 ? 'good' : pct >= 60 ? 'warn' : 'bad';
          return `<tr>
            <td><strong>${roman(b.n)}</strong> · ${esc(b.titulo)}</td>
            <td>${s.completados}/${s.temas}</td>
            <td>${s.intentos}</td>
            <td>${s.aciertos}/${s.total}</td>
            <td>${pct == null ? '—' : `<span class="badge ${cls}">${pct}%</span>`}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>

    <div class="section-title">Fortalezas y aspectos a reforzar</div>
    <div class="grid-2" style="gap:12px">
      <div class="callout ok" style="margin:0">
        <b>Fortalezas</b>
        ${fortalezas.length
          ? `<ul>${fortalezas.map((x) => `<li>Bloque ${roman(x.b.n)} — ${x.s.pctTest}% de acierto</li>`).join('')}</ul>`
          : '<p style="margin:0">Todavía sin datos suficientes. Realiza test para activar este análisis.</p>'}
      </div>
      <div class="callout trap" style="margin:0">
        <b>Reforzar de forma prioritaria</b>
        ${rank.length
          ? `<ul>${rank.slice(0, 5).map((r) => `<li><strong>${r.id}</strong> (${r.pct}% de acierto) — ${esc(r.titulo)}</li>`).join('')}</ul>`
          : '<p style="margin:0">Sin errores registrados. Continúa con simulacros de bloque completo.</p>'}
      </div>
    </div>

    <div class="section-title">Últimos test</div>
    ${his.length
      ? `<table class="data">
          <thead><tr><th>Fecha</th><th>Tema</th><th>Resultado</th><th>% Acierto</th></tr></thead>
          <tbody>${his.map((h) => {
            const p = Math.round((h.aciertos / h.total) * 100);
            const cls = p >= 75 ? 'good' : p >= 60 ? 'warn' : 'bad';
            return `<tr><td>${new Date(h.ts).toLocaleDateString('es-ES')}</td><td>${h.tema}</td><td>${h.aciertos}/${h.total}</td><td><span class="badge ${cls}">${p}%</span></td></tr>`;
          }).join('')}</tbody>
        </table>`
      : '<p>Todavía no has realizado ningún test. Empieza con <code>/test Bloque I - Tema 1 10</code>.</p>'}

    <div class="section-title">Cuadro de mando en Markdown</div>
    <pre><code>${esc(md)}</code></pre>
    <div class="actions">
      <button class="btn primary" id="btnCopiar">Copiar cuadro de mando</button>
      <button class="btn" data-cmd="/calendario">Planificar la semana</button>
    </div>
  </article>`);

  nodo.querySelector('#btnCopiar').addEventListener('click', async (ev) => {
    try {
      await navigator.clipboard.writeText(md);
      ev.target.textContent = '✓ Copiado al portapapeles';
    } catch {
      ev.target.textContent = 'Copia no disponible en este navegador';
    }
  });

  pintar(nodo);
}

function cmdTemario(ref) {
  const lista = ref && resolverBloque(ref) != null ? [resolverBloque(ref)] : BLOQUES.map((b) => b.n);
  const nodo = el(`<article class="card">
    ${cabecera('Temario oficial', 'Programa de la oposición (BOE)', '5 bloques · 37 temas')}
    ${lista.map((n) => {
      const b = bloqueInfo(n);
      return `<div class="section-title">Bloque ${b.roman} · ${esc(b.titulo)}</div>
        <table class="data"><tbody>
        ${temasDeBloque(n).map((t) => {
          const done = P.peek(t.id) && P.peek(t.id).estudiado;
          return `<tr>
            <td style="width:52px"><strong>${t.numero}</strong>${done ? ' ✓' : ''}</td>
            <td>${esc(t.titulo)}</td>
            <td style="width:110px"><button class="btn ghost" data-cmd="/estudiar ${refTema(t)}" style="padding:5px 10px;font-size:12px">Estudiar</button></td>
          </tr>`;
        }).join('')}
        </tbody></table>`;
    }).join('')}
  </article>`);
  pintar(nodo);
}

function cmdAyuda() {
  const nodo = el(`<article class="card">
    ${cabecera('Comandos', 'Cómo utilizar la plataforma', 'Atajos y funcionalidades disponibles')}
    <table class="data">
      <thead><tr><th>Comando</th><th>Función</th></tr></thead>
      <tbody>
        <tr><td><code>/estudiar [Bloque X - Tema Y]</code></td><td>Resumen normativo condensado, artículos clave, plazos, excepciones y trampas habituales del INAP.</td></tr>
        <tr><td><code>/esquema [Bloque X - Tema Y]</code></td><td>Esquema jerárquico en árbol para memorización activa.</td></tr>
        <tr><td><code>/infografia [Bloque X - Tema Y]</code></td><td>Diagrama Mermaid del procedimiento + propuesta de infografía visual. También acepta conceptos: <code>/infografia fases del gasto</code>, <code>/infografia recursos administrativos</code>, <code>/infografia silencio administrativo</code>.</td></tr>
        <tr><td><code>/test [Bloque X - Tema Y] [Nº]</code></td><td>Test tipo examen con 4 opciones, corrección razonada y cita del artículo. Acepta bloque completo: <code>/test Bloque III 20</code>.</td></tr>
        <tr><td><code>/calendario</code></td><td>Planificación semanal dinámica según turnos rotativos y horas realmente disponibles.</td></tr>
        <tr><td><code>/progreso</code></td><td>Cuadro de mando: cobertura, aciertos por bloque, temas con más errores y prioridades.</td></tr>
        <tr><td><code>/temario</code></td><td>Programa oficial completo con acceso directo a cada tema.</td></tr>
      </tbody>
    </table>
    <p style="color:var(--text-faint);font-size:13px">Puedes escribir el tema como <code>Bloque III - Tema 3</code> o abreviado: <code>B3T3</code>.</p>
    <div class="actions">
      <button class="btn primary" data-cmd="/test Bloque I - Tema 1 10">Empezar con un test</button>
      <button class="btn" data-cmd="/temario">Ver el temario</button>
    </div>
  </article>`);
  pintar(nodo);
}

/* ------------------------------------------------------------------ */
/*  Despachador                                                       */
/* ------------------------------------------------------------------ */

function resolverBloque(texto) {
  if (!texto) return null;
  const m = String(texto).match(/bloque\s*([IVX]+|\d)|^\s*\[?b?\s*([1-5])\]?\s*$/i);
  if (!m) return null;
  const r = m[1] || m[2];
  const n = ROMANOS[String(r).toUpperCase()];
  return BLOQUES.some((b) => b.n === n) ? n : null;
}

function ejecutarTest(args) {
  let n = 10;
  let ref = args.trim();
  const mn = ref.match(/\s(\d{1,3})$/);
  if (mn) {
    const cand = ref.slice(0, mn.index).trim();
    if (resolverTema(cand) || resolverBloque(cand) != null) {
      n = Number(mn[1]);
      ref = cand;
    }
  }
  cmdTest(ref, n);
}

function ejecutar(entrada) {
  const raw = String(entrada || '').trim();
  if (!raw) return;
  const m = raw.replace(/^\//, '').match(/^(\S+)\s*([\s\S]*)$/);
  const cmd = (m ? m[1] : '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const args = (m ? m[2] : '').trim();

  switch (cmd) {
    case 'estudiar': case 'resumen': return cmdEstudiar(args);
    case 'esquema': return cmdEsquema(args);
    case 'infografia': return cmdInfografia(args);
    case 'test': case 'simulacro': return ejecutarTest(args);
    case 'calendario': case 'planificacion': return cmdCalendario();
    case 'progreso': case 'dashboard': return cmdProgreso();
    case 'temario': case 'programa': return cmdTemario(args);
    case 'ayuda': case 'help': case 'comandos': return cmdAyuda();
    default: return pintar(noEncontrado(raw));
  }
}

/* ------------------------------------------------------------------ */
/*  Interfaz: barra lateral, cabecera y eventos                       */
/* ------------------------------------------------------------------ */

function pintarNavegacion() {
  nav.innerHTML = BLOQUES.map((b, i) => `
    <div class="bloque ${i === 0 ? 'open' : ''}" data-bloque="${b.n}">
      <button class="bloque-head" data-toggle="${b.n}">
        <span class="caret">▶</span>
        <span>Bloque ${b.roman}</span>
        <span class="cnt">${temasDeBloque(b.n).length}</span>
      </button>
      <div class="bloque-list">
        ${temasDeBloque(b.n).map((t) => `
          <button class="tema-link" data-tema="${t.id}" title="${esc(t.titulo)}">
            <span class="dot">✓</span>
            <span class="tx">${t.numero}. ${esc(t.titulo.length > 62 ? t.titulo.slice(0, 60) + '…' : t.titulo)}</span>
          </button>`).join('')}
      </div>
    </div>`).join('');
  refrescarEstado();
}

function marcarActivo(id) {
  nav.querySelectorAll('.tema-link').forEach((b) => b.classList.toggle('active', b.dataset.tema === id));
}

function refrescarEstado() {
  nav.querySelectorAll('.tema-link').forEach((b) => {
    const r = P.peek(b.dataset.tema);
    b.classList.toggle('done', !!(r && r.estudiado));
  });
  const cob = P.cobertura();
  document.getElementById('coveragePct').textContent = `${cob.pct}%`;
  document.getElementById('coverageBar').style.width = `${cob.pct}%`;
  document.getElementById('coverageTxt').textContent = `${cob.completados} de ${cob.total} temas completados`;
}

function pantallaInicio() {
  const cob = P.cobertura();
  const nodo = el(`<article class="card">
    ${cabecera('Bienvenida', 'Preparación de las oposiciones de la AGE', 'Temario oficial publicado en el BOE · Cuerpos Generales · INAP')}
    <p>Esta plataforma convierte el programa oficial en <strong>material de estudio operativo</strong>: resúmenes normativos con los artículos y plazos que realmente se preguntan, esquemas jerárquicos, diagramas de procedimiento y test tipo examen con corrección razonada.</p>
    <div class="grid-2" style="gap:12px">
      <div class="stat"><div class="k">Bloques</div><div class="v">5</div></div>
      <div class="stat"><div class="k">Temas</div><div class="v">${TEMAS.length}</div></div>
      <div class="stat"><div class="k">Preguntas en banco</div><div class="v">${TEMAS.reduce((s, t) => s + t.preguntas.length, 0)}</div></div>
      <div class="stat"><div class="k">Cobertura actual</div><div class="v">${cob.pct}% <small>${cob.completados}/${cob.total}</small></div></div>
    </div>
    <div class="section-title">Empieza por aquí</div>
    <div class="grid-2" style="gap:12px">
      ${BLOQUES.map((b) => `
        <div class="stat">
          <div class="k">Bloque ${b.roman}</div>
          <div style="font-weight:700;margin:6px 0 10px">${esc(b.titulo)}</div>
          <button class="btn ghost" data-cmd="/estudiar Bloque ${b.roman} - Tema 1" style="padding:6px 10px;font-size:12.5px">Empezar el Tema 1</button>
        </div>`).join('')}
    </div>
    <div class="actions">
      <button class="btn primary" data-cmd="/temario">Ver el temario completo</button>
      <button class="btn" data-cmd="/calendario">Planificar la semana</button>
      <button class="btn" data-cmd="/ayuda">Ver todos los comandos</button>
    </div>
    <p class="kbd-hint">Consejo: escribe <code>/test Bloque III 20</code> para un simulacro completo de bloque.</p>
  </article>`);
  content.appendChild(nodo);
}

/* ------------------------------------------------------------------ */
/*  Arranque                                                          */
/* ------------------------------------------------------------------ */

function aplicarTemaVisual(modo) {
  document.documentElement.setAttribute('data-theme', modo);
  try { localStorage.setItem('opositor-age-theme', modo); } catch { /* sin persistencia */ }
}

function init() {
  pintarNavegacion();
  refrescarEstado();
  pantallaInicio();

  P.onChange(() => refrescarEstado());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    ejecutar(v);
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd]');
    if (btn) {
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      if (cmd.startsWith('#')) return ejecutarAccion(cmd.slice(1));
      return ejecutar(cmd);
    }
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      toggle.closest('.bloque').classList.toggle('open');
      return;
    }
    const link = e.target.closest('[data-tema]');
    if (link) {
      const t = TEMAS.find((x) => x.id === link.dataset.tema);
      if (t) {
        cmdEstudiar(refTema(t));
        document.getElementById('sidebar').classList.remove('open');
      }
    }
  });

  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.getElementById('themeBtn').addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    aplicarTemaVisual(actual);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('¿Reiniciar todo el progreso registrado (temas completados y resultados de test)?')) {
      P.reiniciar();
      content.innerHTML = '';
      pantallaInicio();
    }
  });

  let guardado = 'dark';
  try { guardado = localStorage.getItem('opositor-age-theme') || 'dark'; } catch { /* por defecto */ }
  aplicarTemaVisual(guardado);
}

function ejecutarAccion(accion) {
  const [clave, valor] = accion.split(':');
  if (clave === 'estudiado') {
    P.marcar(valor, 'estudiado');
    refrescarEstado();
    const t = TEMAS.find((x) => x.id === valor);
    document.querySelectorAll('[data-cmd="#estudiado:' + valor + '"]').forEach((b) => {
      b.textContent = '✓ Tema completado';
      b.classList.remove('primary');
    });
    if (t) marcarActivo(t.id);
  }
}

init();
