/* Planificador semanal dinámico para turnos rotativos */

import { esc } from './render.js';
import { getCalendario, setCalendario, temasPendientes, temasParaRepaso, nombreBloque } from './progreso.js';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const TURNOS = {
  manana: { etiqueta: 'Mañana · 07:00-15:00', horas: 4 },
  tarde: { etiqueta: 'Tarde · 15:00-23:00', horas: 4 },
  noche: { etiqueta: 'Noche · 23:00-07:00', horas: 3 },
  descanso: { etiqueta: 'Descanso laboral', horas: 7 },
  libre: { etiqueta: 'Día libre', horas: 8 },
  personalizado: { etiqueta: 'Personalizado', horas: 3 },
};

const MIN_TEMA_NUEVO = 90;   // minutos estimados por tema nuevo
const MIN_REPASO = 45;       // minutos estimados por repaso de tema
const MIN_TEST = 30;         // minutos por test de 10 preguntas
const PREG_POR_TEST = 10;

const cfgInicial = () => ({
  dias: DIAS.map((_, i) => ({ turno: i === 5 ? 'libre' : i === 6 ? 'descanso' : 'manana', horas: i === 5 ? 8 : i === 6 ? 7 : 4 })),
});

function fmt(min) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function renderCalendario(card) {
  const cfg = getCalendario() && getCalendario().dias ? getCalendario() : cfgInicial();

  card.innerHTML = `
    <div class="card-head">
      <span class="tag">Planificador</span>
      <div>
        <h2>Calendario de estudio · turnos rotativos</h2>
        <p class="sub">Indica tu turno de trabajo de cada día y el plan se recalcula al instante</p>
      </div>
    </div>
    <div id="calForm"></div>
    <div id="calPlan"></div>
  `;

  const form = card.querySelector('#calForm');
  const plan = card.querySelector('#calPlan');

  form.innerHTML = `
    <div class="grid-2" style="gap:18px">
      <div>
        <div class="section-title">Semana laboral</div>
        ${DIAS.map((d, i) => `
          <div class="shift-row">
            <span class="day">${d.slice(0, 3)}</span>
            <select data-dia="${i}" class="turno-sel">
              ${Object.entries(TURNOS).map(([k, v]) => `
                <option value="${k}" ${cfg.dias[i].turno === k ? 'selected' : ''}>${esc(v.etiqueta)}</option>`).join('')}
            </select>
            <input type="number" min="0" max="14" step="0.5" data-horas="${i}" value="${cfg.dias[i].horas}" title="Horas efectivas de estudio disponibles" />
          </div>`).join('')}
      </div>
      <div id="calResumen"></div>
    </div>
  `;

  const resumen = form.querySelector('#calResumen');

  const guardar = () => setCalendario({ dias: cfg.dias, actualizado: Date.now() });

  form.querySelectorAll('.turno-sel').forEach((sel) => {
    sel.addEventListener('change', () => {
      const i = Number(sel.dataset.dia);
      cfg.dias[i].turno = sel.value;
      const h = TURNOS[sel.value].horas;
      cfg.dias[i].horas = h;
      form.querySelector(`[data-horas="${i}"]`).value = h;
      guardar();
      pintar();
    });
  });

  form.querySelectorAll('[data-horas]').forEach((inp) => {
    inp.addEventListener('input', () => {
      const i = Number(inp.dataset.horas);
      const v = Math.max(0, Math.min(14, Number(inp.value) || 0));
      cfg.dias[i].horas = v;
      guardar();
      pintar();
    });
  });

  function pintar() {
    const totalMin = Math.round(cfg.dias.reduce((s, d) => s + Number(d.horas), 0) * 60);
    const tercio = totalMin / 3;

    const pend = temasPendientes();
    const repaso = temasParaRepaso(6);
    const nNuevos = Math.floor(tercio / MIN_TEMA_NUEVO);
    const nRepasos = Math.floor(tercio / MIN_REPASO);
    const nTests = Math.floor(tercio / MIN_TEST);

    const nuevosAsign = pend.slice(0, Math.max(nNuevos, 0));
    const repasoAsign = repaso.slice(0, Math.max(nRepasos, 0));

    resumen.innerHTML = `
      <div class="section-title">Reparto equitativo</div>
      <div class="grid-2" style="gap:10px">
        <div class="stat"><div class="k">Horas semanales</div><div class="v">${fmt(totalMin)}</div></div>
        <div class="stat"><div class="k">Conceptos nuevos</div><div class="v">${fmt(tercio)}</div></div>
        <div class="stat"><div class="k">Repaso espaciado</div><div class="v">${fmt(tercio)}</div></div>
        <div class="stat"><div class="k">Test y simulacros</div><div class="v">${fmt(tercio)}</div></div>
      </div>
      <p style="color:var(--text-dim);font-size:13px;margin-top:12px">
        El reparto es equitativo (un tercio por actividad). Si necesitas priorizar, aumenta el peso del
        <strong>repaso espaciado</strong> cuando la tasa de acierto de un bloque baje del 70%.
      </p>
    `;

    plan.innerHTML = `
      <div class="section-title">Planificación diaria</div>
      <table class="data">
        <thead>
          <tr><th>Día</th><th>Turno</th><th>Disponible</th><th>Nuevos</th><th>Repaso</th><th>Test</th></tr>
        </thead>
        <tbody>
          ${DIAS.map((d, i) => {
            const h = Number(cfg.dias[i].horas);
            const m = h * 60 / 3;
            return `<tr>
              <td><strong>${d}</strong></td>
              <td>${esc(TURNOS[cfg.dias[i].turno].etiqueta)}</td>
              <td>${fmt(h * 60)}</td>
              <td>${fmt(m)}</td>
              <td>${fmt(m)}</td>
              <td>${fmt(m)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <div class="section-title">Tareas de la semana</div>
      <div class="grid-2" style="gap:12px">
        <div class="callout key" style="margin:0">
          <b>Conceptos nuevos (${fmt(tercio)})</b>
          ${nuevosAsign.length
            ? `<ul>${nuevosAsign.map((t) => `<li><strong>${t.id}</strong> · ${esc(nombreBloque(t.bloque))} — ${esc(t.titulo)}</li>`).join('')}</ul>`
            : '<p style="margin:0">Sin temas pendientes: has cubierto todo el temario. Dedica este tiempo a simulacros completos.</p>'}
        </div>
        <div class="callout ok" style="margin:0">
          <b>Repaso espaciado (${fmt(tercio)})</b>
          ${repasoAsign.length
            ? `<ul>${repasoAsign.map((t) => `<li><strong>${t.id}</strong> · ${esc(nombreBloque(t.bloque))} — ${esc(t.titulo)}</li>`).join('')}</ul>`
            : '<p style="margin:0">Aún no hay temas estudiados que repasar. Comienza por los conceptos nuevos.</p>'}
        </div>
        <div class="callout trap" style="margin:0">
          <b>Test y simulacros (${fmt(tercio)})</b>
          <ul>
            <li><strong>${Math.max(nTests, 0)} test</strong> de ${PREG_POR_TEST} preguntas esta semana.</li>
            <li>Alterna test por tema (memoria inmediata) con test de bloque completo (memoria diferida).</li>
            <li>Registra siempre el resultado: el cuadro de mando se actualiza solo.</li>
          </ul>
        </div>
        <div class="callout" style="margin:0;border-color:var(--border);background:var(--bg-elev)">
          <b>Reglas de oro</b>
          <ul>
            <li>Turno de <strong>noche</strong>: estudia al despertar, nunca al llegar a casa.</li>
            <li>Turno de <strong>tarde</strong>: aprovecha la mañana previa al trabajo.</li>
            <li>Bloquea el mismo tramo horario cada día: el hábito reduce la resistencia.</li>
            <li>Antes de dormir, repaso activo de 15 minutos del tema del día.</li>
          </ul>
        </div>
      </div>
    `;
  }

  pintar();
}
