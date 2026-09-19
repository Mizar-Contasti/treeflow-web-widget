import { ICONS } from './icons.js';
import { renderHtml } from './html-block.js';

// Las etiquetas y los payloads los escribe quien construye el bot, no un
// visitante, pero acaban dentro de atributos HTML y de un onclick. Escaparlos
// cuesta nada y evita que un apóstrofo en "¿Qué día?" rompa el botón entero.
function esc(valor) {
  return String(valor == null ? '' : valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// La misma sintaxis que entiende el widget de la app (utils/textFormatting):
// **negrita**, *cursiva*, __subrayado__. Sin esto, el bot escribía
// "**CECyTE-TBC Chiapas**" con los asteriscos a la vista, mientras que en la
// app el mismo mensaje salía en negrita.
//
// Se escapa ANTES de aplicar los marcadores, así que lo único que llega a ser
// HTML son las etiquetas que pone esta función; el texto del bot nunca.
export function conFormato(texto) {
  return esc(texto)
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/__([^_]+?)__/g, '<u>$1</u>');
}

export function renderRichMessage(block) {
  if (!block) return '';

  // Handle array of blocks (for multi-item support)
  if (Array.isArray(block)) {
    return block.map(b => renderRichMessage(b)).join('');
  }

  // Handle 'items' property within a block (new structure)
  if (block.items && Array.isArray(block.items) && block.items.length > 0) {
    // If it's a carousel, we handle items specifically in renderCarousel
    if (block.type === 'carousel') {
      return renderCarousel(block);
    }

    // For other types, we might want to render items sequentially or based on alignment
    // But for now, let's assume the block itself is the container or the specific renderer handles items
    // If the renderer doesn't handle items, we map them here
    const renderersWithItems = ['carousel', 'list']; // Add others if they handle their own items
    if (!renderersWithItems.includes(block.type)) {
      // If the block type is supposed to be a single item but has 'items', 
      // it might be a container. Let's try to render each item.
      // However, usually 'items' implies a specific layout like Carousel.
      // Let's stick to the specific renderers handling their items if needed.
    }
  }

  switch (block.type) {
    case 'card':
      return renderCard(block);
    case 'carousel':
      return renderCarousel(block);
    case 'video':
      return renderVideo(block);
    case 'audio':
      return renderAudio(block);
    case 'location':
      return renderLocation(block);
    case 'file':
      return renderFile(block);
    case 'image':
      return renderImage(block);
    // La plataforma emite 'buttons' en plural; 'button' y 'options' se dejan por
    // los payloads viejos. Sin el plural, el bloque más usado de todos caía en el
    // default de abajo y no se pintaba nada.
    case 'buttons':
      return renderButtons(block);
    case 'button': // Standalone buttons or options
    case 'options':
    case 'quick_replies':
      return renderQuickReplies(block);
    case 'accordion':
      return renderAccordion(block);
    case 'dropdown':
      return renderDropdown(block);
    case 'html':
      return renderHtml(block);
    case 'divider':
      return renderDivider(block);
    case 'paragraph':
    case 'text':
      return renderParagraph(block);
    default:
      console.warn('Unknown block type:', block.type, block);
      return '';
  }
}

function renderParagraph(block) {
  const items = block.items || [block];
  // Sin espacios entre las etiquetas y el texto: `.rich-paragraph` lleva
  // `white-space: pre-wrap` para respetar los saltos de línea del mensaje, y
  // también respetaba los de esta plantilla. Cada párrafo salía con una línea
  // vacía y seis espacios de sangría delante, y otra línea vacía detrás.
  return items.map(item =>
    `<div class="rich-paragraph">${conFormato(item.text || item.content || '')}</div>`
  ).join('');
}

function renderCard(block) {
  // Support both single object and items array (though Card usually is single, 
  // but if we have multiple cards not in a carousel, we render them stacked)
  const items = block.items || [block];

  return items.map(item => {
    const rawImageUrl = item.image || item.imageUrl || item.mediaUrl || item.url;
    const imageUrl = rawImageUrl || 'https://picsum.photos/400/200';

    return `
    <div class="rich-card">
      ${imageUrl ? `<img src="${imageUrl}" class="rich-card-image" alt="${item.title || 'Card Image'}">` : ''}
      <div class="rich-card-content">
        ${item.title ? `<div class="rich-card-title">${item.title}</div>` : ''}
        ${item.subtitle ? `<div class="rich-card-subtitle">${item.subtitle}</div>` : ''}
        ${item.text ? `<div class="rich-card-text">${item.text}</div>` : ''}
      </div>
      ${(item.actions || item.buttons) && (item.actions || item.buttons).length > 0 ? `
        <div class="rich-card-actions">
          ${(item.actions || item.buttons).map(action => renderAction(action)).join('')}
        </div>
      ` : ''}
    </div>
    `;
  }).join('');
}

function renderCarousel(block) {
  const items = block.items || [];
  if (items.length === 0) return '';

  // Generate unique ID for carousel to handle navigation
  const carouselId = `carousel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <div class="rich-carousel" id="${carouselId}">
      <div class="carousel-container">
        <div class="carousel-track-container">
          <div class="carousel-track">
            ${items.map(item => `
              <div class="carousel-item">
                ${renderCard(item)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderVideo(block) {
  const items = block.items || [block];

  return items.map(item => {
    let content = '';

    if (item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'))) {
      // Extract video ID using regex for better robustness
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = item.url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (videoId) {
        const origin = window.location.origin;
        content = `<iframe src="https://www.youtube.com/embed/${videoId}?origin=${origin}&modestbranding=1&rel=0" allowfullscreen></iframe>`;
      }
    } else if (item.url && item.url.includes('vimeo.com')) {
      const videoId = item.url.split('/').pop();
      if (videoId) {
        content = `<iframe src="https://player.vimeo.com/video/${videoId}" allowfullscreen></iframe>`;
      }
    } else if (item.url) {
      // Direct video file
      content = `<video src="${item.url}" controls></video>`;
    }

    return `
      <div class="rich-video">
        ${content}
      </div>
    `;
  }).join('');
}

function renderAudio(block) {
  const items = block.items || [block];

  return items.map(item => {
    // Generate random waveform bars
    const bars = Array(20).fill(0).map(() => Math.floor(Math.random() * 60) + 20);
    const waveformHtml = bars.map(height =>
      `<div class="waveform-bar" style="height: ${height}%"></div>`
    ).join('');

    return `
    <div class="rich-audio">
      <button class="audio-control play-pause-btn" data-src="${item.url}">
        ${ICONS.PLAY}
      </button>
      <div class="audio-info">
        <div class="audio-title">${item.title || 'Audio'}</div>
        <div class="audio-waveform">
          ${waveformHtml}
        </div>
        <div class="audio-duration">0:00</div>
      </div>
    </div>
    `;
  }).join('');
}

function renderLocation(block) {
  const items = block.items || [block];

  return items.map(item => {
    // La UI escribe `lat`/`long` (ver frontend/src/types/rich-messages.ts); el
    // widget sólo miraba `latitude`/`longitude`, así que toda ubicación creada
    // desde el panel caía al botón de "compartir mi ubicación" y nunca salía el
    // mapa. Se aceptan los dos nombres.
    const lat = item.lat != null ? item.lat : item.latitude;
    const lon = item.long != null ? item.long : item.longitude;
    if (lat != null && lon != null) {
      return `
        <div class="rich-location">
          <div class="location-map">
             ${ICONS.MAP}
          </div>
          <div class="location-info">
            <div class="location-name">${esc(item.title || 'Ubicación')}</div>
            <div class="location-address">${esc(item.address || `${lat}, ${lon}`)}</div>
            <a href="${esc(item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`)}" target="_blank" rel="noopener" class="action-btn primary">
              ${ICONS.LOCATION_ON} Ver en Mapas
            </a>
          </div>
        </div>
      `;
    } else {
      // Request location button
      return `
        <div class="rich-location">
          <div class="location-info">
            <div class="location-name">${item.title || 'Compartir Ubicación'}</div>
            <button class="share-location-btn">
              ${ICONS.LOCATION_ON} Compartir mi ubicación actual
            </button>
          </div>
        </div>
      `;
    }
  }).join('');
}

function renderFile(block) {
  const items = block.items || [block];

  return items.map(item => `
    <div class="rich-file">
      <div class="file-icon-container">
        ${ICONS.INSERT_DRIVE_FILE}
      </div>
      <div class="file-info">
        <div class="file-name">${esc(item.filename || item.name || item.title || 'Archivo adjunto')}</div>
        ${item.size ? `<div class="file-size">${esc(item.size)}</div>` : ''}
      </div>
      <button class="file-download-btn" onclick="this.getRootNode().host.handleFileDownload('${esc(item.url)}', '${esc(item.filename || item.name || item.title || 'archivo')}')" title="Descargar">
        ${ICONS.DOWNLOAD}
      </button>
    </div>
  `).join('');
}

function renderImage(block) {
  const items = block.items || [block];

  return items.map(item => {
    const finalUrl = item.url || 'https://picsum.photos/400/200';
    return `
    <div class="rich-card">
      <img src="${esc(finalUrl)}" class="rich-image-standalone" alt="${esc(item.alt || item.title || '')}">
      ${item.title ? `<div class="rich-card-content"><div class="rich-card-text">${esc(item.title)}</div></div>` : ''}
    </div>
    `;
  }).join('');
}

function renderButtons(block) {
  const items = block.items || block.options || block.buttons || [];

  if (items.length === 0) return '';

  return `
    <div class="rich-card-actions" style="border: none; padding: 0;">
      ${items.map(action => renderAction(action)).join('')}
    </div>
  `;
}

function renderAccordion(block) {
  const items = block.items || [];
  if (items.length === 0) return '';

  // <details> nativo: se pliega y despliega sin una línea de JavaScript, y
  // funciona aunque el script del widget falle a medias.
  return `
    <div class="rich-accordion">
      ${items.map(item => `
        <details class="rich-accordion-item">
          <summary class="rich-accordion-title">${esc(item.title || '')}</summary>
          <div class="rich-accordion-content">${esc(item.content || '')}</div>
        </details>
      `).join('')}
    </div>
  `;
}

function renderDropdown(block) {
  const items = block.items || block.options || [];
  if (items.length === 0) return '';

  const placeholder = block.placeholder || 'Selecciona una opción';
  const buttonLabel = block.buttonLabel || 'Enviar';

  // El botón lee el <select> hermano. Así no hace falta añadirle métodos al
  // custom element ni registrar listeners sobre HTML que se inyecta como texto.
  return `
    <div class="rich-dropdown">
      <div class="rich-dropdown-label">${esc(placeholder)}</div>
      <select class="rich-dropdown-select">
        <option value="" disabled selected>${esc(placeholder)}</option>
        ${items.map(item => `
          <option value="${esc(item.value != null ? item.value : item.label)}">${esc(item.label || item.value || '')}</option>
        `).join('')}
      </select>
      <button class="action-btn rich-dropdown-send"
              onclick="var s=this.parentNode.querySelector('.rich-dropdown-select'); if(s&amp;&amp;s.value){this.getRootNode().host.sendMessage(s.value);}">
        ${esc(buttonLabel)}
      </button>
    </div>
  `;
}

function renderDivider(block) {
  const estilo = ['solid', 'dashed', 'dotted'].includes(block.style)
    ? block.style : 'solid';
  const etiqueta = block.label || (Array.isArray(block.items) ? block.items[0] : null);

  if (etiqueta) {
    return `
      <div class="rich-divider-con-texto rich-divider-${estilo}">
        <span>${esc(etiqueta)}</span>
      </div>
    `;
  }
  return `<hr class="rich-divider rich-divider-${estilo}">`;
}

function renderQuickReplies(block) {
  const items = block.items || block.options || block.quick_replies || [];
  if (items.length === 0) return '';

  return `
    <div class="quick-replies-container">
      ${items.map(action => renderAction(action, 'chip')).join('')}
    </div>
  `;
}

function renderAction(action, style = 'button') {
  const label = action.label || action.text || action.title;
  const payload = action.payload || action.value || label;

  let iconHtml = '';
  if (action.image || action.iconUrl) {
    iconHtml = `<img src="${esc(action.image || action.iconUrl)}" class="action-icon-img" alt="" />`;
  } else if (action.icon) {
    // Check if icon is a URL
    if (action.icon.startsWith('http') || action.icon.startsWith('data:')) {
      iconHtml = `<img src="${esc(action.icon)}" class="action-icon-img" alt="" />`;
    } else {
      iconHtml = `<span class="action-icon">${ICONS[action.icon] || ''}</span>`;
    }
  }

  const className = style === 'chip' ? 'suggestion-chip' : 'action-btn';

  // Una acción de tipo 'link' lleva una URL en el payload. Se ignoraba el tipo y
  // todo se mandaba como mensaje, así que un botón "Ver la carta (PDF)" acababa
  // escribiéndole al bot la URL entera en vez de abrirla.
  if (action.type === 'link') {
    return `
    <a class="${className} enlace" href="${esc(payload)}" target="_blank" rel="noopener">
      ${iconHtml} ${esc(label)}
    </a>
  `;
  }

  return `
    <button class="${className}" onclick="this.getRootNode().host.sendMessage('${esc(payload)}')">
      ${iconHtml} ${esc(label)}
    </button>
  `;
}
