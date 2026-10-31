/* Utilidades de renderizado: Markdown (marked) y diagramas (Mermaid) */

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function temaGrafico() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'default' : 'dark';
}

let mermaidListo = false;

export function initMermaid() {
  if (!window.mermaid) return false;
  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: temaGrafico(),
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    flowchart: { curve: 'basis', useMaxWidth: true, htmlLabels: true },
  });
  mermaidListo = true;
  return true;
}

/** Convierte Markdown en HTML y realza los avisos de examen. */
export function renderMarkdown(container, texto) {
  if (!window.marked) {
    container.textContent = texto;
    return;
  }
  container.innerHTML = window.marked.parse(texto, { gfm: true, breaks: false });
  container.classList.add('md');
  container.querySelectorAll('blockquote').forEach((bq) => {
    const t = (bq.textContent || '').trim().toLowerCase();
    if (t.startsWith('trampa')) bq.classList.add('q-trap');
    else if (t.startsWith('clave') || t.startsWith('idea-fuerza') || t.startsWith('importante') || t.startsWith('ojo')) bq.classList.add('q-key');
  });
}

let seqMermaid = 0;

/** Inserta un diagrama Mermaid; si falla, muestra el código fuente. */
export async function renderMermaid(container, codigo) {
  if (!window.mermaid) {
    container.innerHTML = `<pre><code>${esc(codigo)}</code></pre>`;
    return;
  }
  try {
    if (!mermaidListo) initMermaid();
    const id = `mmd-${Date.now().toString(36)}-${++seqMermaid}`;
    const { svg } = await window.mermaid.render(id, codigo);
    container.innerHTML = svg;
  } catch (err) {
    console.warn('[mermaid] error de renderizado:', err);
    container.innerHTML = `<pre><code>${esc(codigo)}</code></pre>`;
  }
}

/** Convierte texto plano en un nodo seguro. */
export function el(html) {
  const d = document.createElement('div');
  d.innerHTML = html.trim();
  return d.firstElementChild;
}
