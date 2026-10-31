/* Motor de test tipo examen INAP: 4 opciones, corrección razonada por artículo */

import { esc } from './render.js';

const LETRAS = ['A', 'B', 'C', 'D'];

export function mezclar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Ejecuta un test interactivo dentro de `card`.
 * @param {HTMLElement} card contenedor
 * @param {Array} preguntas preguntas ya seleccionadas
 * @param {object} meta { titulo, onRepetir, onResumen }
 * @param {Function} onFinish recibe { aciertos, total }
 */
export function iniciarTest(card, preguntas, meta, onFinish) {
  const total = preguntas.length;
  let idx = 0;
  let aciertos = 0;
  const fallos = [];
  const detalle = [];

  function pintar() {
    const q = preguntas[idx];
    card.innerHTML = `
      <div class="test-progress">
        <div class="bar"><i style="width:${(idx / total) * 100}%"></i></div>
        <span>${idx + 1} / ${total}</span>
      </div>
      <p class="q-stem"><span class="q-num">${idx + 1}.</span> ${esc(q.pregunta)}</p>
      <div class="opts">
        ${q.opciones.map((o, i) => `
          <button class="opt" data-i="${i}">
            <span class="ltr">${LETRAS[i]}</span><span class="tx">${esc(o)}</span>
          </button>`).join('')}
      </div>
      <div class="explain" style="display:none"></div>
    `;
    card.querySelectorAll('.opt').forEach((b) => {
      b.addEventListener('click', () => responder(Number(b.dataset.i)));
    });
  }

  function responder(elegida) {
    const q = preguntas[idx];
    const ok = elegida === q.correcta;
    if (ok) aciertos += 1;
    else fallos.push({ n: idx + 1, q, elegida });
    detalle.push({ temaId: q.temaId || null, ok });

    card.querySelectorAll('.opt').forEach((b) => {
      const i = Number(b.dataset.i);
      b.disabled = true;
      if (i === q.correcta) b.classList.add('correct');
      else if (i === elegida) b.classList.add('wrong');
    });

    const ex = card.querySelector('.explain');
    ex.style.display = 'block';
    ex.innerHTML = `
      <h4>${ok ? '✓ Respuesta correcta' : '✕ Respuesta incorrecta'}</h4>
      <p>${esc(q.explicacion)}</p>
      <span class="ref">${esc(q.referencia || '')}</span>
      <div class="actions">
        <button class="btn primary" id="btnSiguiente">
          ${idx + 1 === total ? 'Ver resultados' : 'Siguiente pregunta'}
        </button>
      </div>
    `;
    ex.querySelector('#btnSiguiente').addEventListener('click', () => {
      idx += 1;
      if (idx >= total) resultados();
      else pintar();
    });
    ex.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function resultados() {
    const pct = Math.round((aciertos / total) * 100);
    const veredicto = pct >= 90 ? 'Excelente · nivel de corte superado con holgura'
      : pct >= 75 ? 'Buen nivel · apto en convocatoria real'
      : pct >= 60 ? 'Apto justo · conviene reforzar'
      : 'Insuficiente · repasa el tema antes de continuar';
    card.innerHTML = `
      <div class="result-hero">
        <div class="ring" style="--p:${pct}%">
          <div class="inner">
            <div>
              <div class="big">${pct}%</div>
              <div style="font-size:12px;color:var(--text-faint)">aciertos</div>
            </div>
          </div>
        </div>
        <div class="lbl"><strong>${aciertos} de ${total}</strong> respuestas correctas</div>
        <div class="lbl" style="margin-top:4px">${veredicto}</div>
      </div>
      <div class="section-title">Revisión de los fallos</div>
      ${fallos.length
        ? fallos.map((f) => `
          <div class="explain">
            <p class="q-stem"><span class="q-num">${f.n}.</span> ${esc(f.q.pregunta)}</p>
            <p style="margin:6px 0">
              Tu respuesta: <span class="badge bad">${LETRAS[f.elegida]}) ${esc(f.q.opciones[f.elegida])}</span><br/>
              Correcta: <span class="badge good">${LETRAS[f.q.correcta]}) ${esc(f.q.opciones[f.q.correcta])}</span>
            </p>
            <p>${esc(f.q.explicacion)}</p>
            <span class="ref">${esc(f.q.referencia || '')}</span>
          </div>`).join('')
        : '<p>Sin fallos: dominio completo del cuestionario. Sube el número de preguntas o pasa al siguiente tema.</p>'}
      <div class="actions">
        <button class="btn" id="btnRepetir">Repetir test</button>
        <button class="btn ghost" id="btnResumen">Ver resumen del tema</button>
      </div>
    `;
    const r = card.querySelector('#btnRepetir');
    if (r && meta.onRepetir) r.addEventListener('click', meta.onRepetir);
    const v = card.querySelector('#btnResumen');
    if (v && meta.onResumen) v.addEventListener('click', meta.onResumen);
    if (onFinish) onFinish({ aciertos, total, detalle });
  }

  pintar();
}
