// Bloque `html` de los mensajes enriquecidos: HTML escrito en el constructor de
// mensajes, o devuelto por una herramienta o una API a través de una variable
// de sesión (`{{noticias}}`).
//
// Es el mismo bloque que pinta el widget de la app (RichHtml.tsx) y sigue sus
// reglas: mismas etiquetas permitidas, mismas formas de traer el contenido.
// Todo lo que se pinta pasa por DOMPurify, porque ese HTML puede venir de una
// API de terceros y acaba dentro de la página de un cliente.

import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'blockquote',
  'a', 'img', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'code', 'pre',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr', 'br', 'small', 'sub', 'sup', 'figure', 'figcaption', 'mark',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'style', 'width', 'height',
  'target', 'rel', 'data-*',
];

const FORBID_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'input'];

// Un enlace dentro del chat no debe llevarse la página del cliente: se abre en
// otra pestaña, y sin dar acceso a `window.opener`.
DOMPurify.addHook('afterSanitizeAttributes', (nodo) => {
  if (nodo.tagName === 'A' && nodo.getAttribute('href')) {
    nodo.setAttribute('target', '_blank');
    nodo.setAttribute('rel', 'noopener noreferrer');
  }
});

export function sanitizarHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
    FORBID_TAGS,
  });
}

function esc(valor) {
  return String(valor == null ? '' : valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Texto que sobra al quitar lo ya interpretado y las etiquetas.
const sinEtiquetas = (texto) => texto.replace(/<[^>]*>/g, '').trim();

// El contenido puede ser HTML o un JSON que lo lleva dentro, y el JSON puede ir
// envuelto en etiquetas (`<div>{{noticias}}</div>` con la variable ya resuelta).
// Se busca el JSON dentro del texto sólo si no hay nada más que etiquetas
// alrededor: `<p>Ver [1,2]</p>` es HTML con corchetes, no una lista.
function extraerJson(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    // no es JSON tal cual
  }
  const pares = [['{', '}'], ['[', ']']];
  for (const [abre, cierra] of pares) {
    const desde = texto.indexOf(abre);
    const hasta = texto.lastIndexOf(cierra);
    if (desde === -1 || hasta <= desde) continue;
    const trozo = texto.slice(desde, hasta + 1);
    if (sinEtiquetas(texto.replace(trozo, '')) !== '') continue;
    try {
      return JSON.parse(trozo);
    } catch {
      // este trozo no es JSON; se prueba con el otro par
    }
  }
  return null;
}

// Una fila de una lista: imagen, título y el contenido en `content`, `html` o
// `excerpt`. Lo que llega de una API se escapa al ponerlo en atributos.
function htmlDeElemento(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (typeof item !== 'object') return String(item);

  const imagen = item.image
    ? `<img src="${esc(item.image)}" alt="${esc(item.title || '')}" style="max-width: 100%; border-radius: 8px; margin: 8px 0; display: block;" />`
    : '';
  let contenido = '';
  if (typeof item.content === 'string') contenido = item.content;
  else if (typeof item.html === 'string') contenido = item.html;
  else if (typeof item.excerpt === 'string') contenido = `<p>${item.excerpt}</p>`;
  return `<div class="treeflow-html-block-item" style="margin-bottom: 20px;">${imagen}${contenido}</div>`;
}

/**
 * El HTML (sin sanear) que hay que pintar para un elemento del bloque.
 * Acepta un `{ html }`, un `{ content }`, un string con HTML, o un JSON —objeto
 * o lista— cuyas filas llevan su propio HTML.
 */
export function htmlDeDato(data) {
  if (!data) return '';

  let bruto = data;
  if (typeof data === 'object') {
    if (typeof data.html === 'string') bruto = data.html;
    else if (typeof data.content === 'string') bruto = data.content;
  }

  if (typeof bruto === 'string') {
    const texto = bruto.trim();
    const json = extraerJson(texto);
    if (json && typeof json === 'object') bruto = json;
    else return texto;
  }

  if (bruto && typeof bruto === 'object') {
    let filas = [];
    if (Array.isArray(bruto)) filas = bruto;
    else if (Array.isArray(bruto.data)) filas = bruto.data;
    else if (Array.isArray(bruto.items)) filas = bruto.items;
    else if (Array.isArray(bruto.noticias)) filas = bruto.noticias;
    else if (Array.isArray(bruto.key_value)) filas = bruto.key_value;
    else if (bruto.key_value && typeof bruto.key_value === 'object') {
      if (Array.isArray(bruto.key_value.data)) filas = bruto.key_value.data;
      else if (Array.isArray(bruto.key_value.items)) filas = bruto.key_value.items;
    } else if (typeof bruto.content === 'string' || typeof bruto.html === 'string') {
      filas = [bruto];
    }

    if (filas.length > 0) {
      return filas
        .map(htmlDeElemento)
        .filter(Boolean)
        .join('<hr style="margin: 20px 0; border: 0; border-top: 1px solid rgba(128,128,128,0.2);" />');
    }
  }

  // Un objeto sin nada que pintar no se convierte en "[object Object]".
  return typeof bruto === 'object' ? '' : String(bruto || '');
}

/** Pinta un bloque `{ type: 'html', items: [{ html }] }` ya saneado. */
export function renderHtml(block) {
  const elementos = Array.isArray(block.items) && block.items.length > 0 ? block.items : [block];
  const cuerpo = elementos
    .map((elemento) => sanitizarHtml(htmlDeDato(elemento)))
    .filter(Boolean)
    .map((limpio) => `<div class="rich-html">${limpio}</div>`)
    .join('');
  if (!cuerpo) return '';
  return `<div class="rich-html-block${block.align === 'horizontal' ? ' horizontal' : ''}">${cuerpo}</div>`;
}
