import { ICONS } from './icons.js';

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
    case 'button': // Standalone buttons or options
    case 'options':
    case 'quick_replies':
      return renderQuickReplies(block);
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
  return items.map(item => `
    <div class="rich-paragraph">
      ${item.text || item.content || ''}
    </div>
  `).join('');
}

function renderCard(block) {
  // Support both single object and items array (though Card usually is single, 
  // but if we have multiple cards not in a carousel, we render them stacked)
  const items = block.items || [block];

  return items.map(item => {
    const imageUrl = item.image || item.imageUrl || item.mediaUrl || item.url;

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
    // If we have coordinates, show map preview (static image or placeholder)
    // For now, we'll use a placeholder structure that can be enhanced
    if (item.latitude && item.longitude) {
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${item.latitude},${item.longitude}&zoom=15&size=400x150&markers=color:red%7C${item.latitude},${item.longitude}&key=YOUR_API_KEY`; // Placeholder key
      // Since we might not have a key, let's use a generic map icon/placeholder if image fails

      return `
        <div class="rich-location">
          <div class="location-map">
             ${ICONS.MAP}
          </div>
          <div class="location-info">
            <div class="location-name">${item.title || 'Ubicación'}</div>
            <div class="location-address">${item.address || `${item.latitude}, ${item.longitude}`}</div>
            <a href="https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}" target="_blank" class="action-btn primary">
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
        <div class="file-name">${item.title || 'Archivo adjunto'}</div>
        ${item.size ? `<div class="file-size">${item.size}</div>` : ''}
      </div>
      <button class="file-download-btn" onclick="this.getRootNode().host.handleFileDownload('${item.url}', '${item.title || 'archivo'}')" title="Descargar">
        ${ICONS.DOWNLOAD}
      </button>
    </div>
  `).join('');
}

function renderImage(block) {
  const items = block.items || [block];

  return items.map(item => `
    <div class="rich-card">
      <img src="${item.url}" class="rich-image-standalone" alt="${item.title || 'Image'}">
      ${item.title ? `<div class="rich-card-content"><div class="rich-card-text">${item.title}</div></div>` : ''}
    </div>
  `).join('');
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
  // Determine style based on action type or properties
  // For now, we render them all as buttons that send a message
  const label = action.label || action.text || action.title;
  const payload = action.payload || action.value || label;

  let iconHtml = '';
  if (action.image || action.iconUrl) {
    iconHtml = `<img src="${action.image || action.iconUrl}" class="action-icon-img" alt="" />`;
  } else if (action.icon) {
    // Check if icon is a URL
    if (action.icon.startsWith('http') || action.icon.startsWith('data:')) {
      iconHtml = `<img src="${action.icon}" class="action-icon-img" alt="" />`;
    } else {
      iconHtml = `<span class="action-icon">${ICONS[action.icon] || ''}</span>`;
    }
  }

  const className = style === 'chip' ? 'suggestion-chip' : 'action-btn';

  return `
    <button class="${className}" onclick="this.getRootNode().host.sendMessage('${payload}')">
      ${iconHtml} ${label}
    </button>
  `;
}
