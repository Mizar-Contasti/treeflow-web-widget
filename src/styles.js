export const WIDGET_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after {
    font-family: var(--tfw-font-family);
    box-sizing: border-box;
  }
  
  :host {
    position: fixed;
    bottom: var(--tfw-widget-position-bottom, 20px);
    right: var(--tfw-widget-position-right, 20px);
    z-index: var(--tfw-widget-z-index, 10000);
    font-family: var(--tfw-font-family, 'Open Sans', sans-serif);
  }
  
  .widget-button {
    width: var(--tfw-launcher-size, var(--tfw-widget-button-size, 60px));
    height: var(--tfw-launcher-size, var(--tfw-widget-button-size, 60px));
    border-radius: 50%;
    background: var(--tfw-widget-button-bg, var(--tfw-primary-color, #2563eb));
    color: var(--tfw-widget-button-color, #ffffff);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .widget-button svg, .widget-button span, .widget-button img {
    width: var(--tfw-launcher-icon-size, 28px);
    height: var(--tfw-launcher-icon-size, 28px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .widget-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    filter: brightness(1.15);
  }
  
  .chat-window {
    position: fixed;
    right: var(--tfw-widget-position-right, 20px);
    bottom: var(--tfw-widget-position-bottom, 20px);
    width: var(--tfw-widget-width, 380px);
    height: var(--tfw-widget-height, 600px);
    background: var(--tfw-background-color, #ffffff);
    border-radius: var(--tfw-border-radius, 12px);
    box-shadow: 0 8px 32px var(--tfw-shadow-color, rgba(0, 0, 0, 0.12));
    display: none;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.8);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: var(--tfw-widget-z-index, 10000);
  }
  
  /* Closed state - Hidden */
  .chat-window.closed {
    display: none !important;
    opacity: 0;
    pointer-events: none;
  }
  
  /* Open state - Normal window */
  .chat-window.open {
    display: flex;
    position: fixed;
    right: var(--tfw-widget-position-right, 20px);
    bottom: var(--tfw-widget-position-bottom, 20px);
    top: auto;
    left: auto;
    width: var(--tfw-widget-width, 380px);
    height: var(--tfw-widget-height, 600px);
    transform: scale(1);
    opacity: 1;
    cursor: default;
  }
  
  /* Maximized state - Fullscreen */
  .chat-window.maximized {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    transform: scale(1);
    opacity: 1;
    z-index: 99999;
  }
  
  /* Hide content when closed */
  .chat-window.closed .chat-header,
  .chat-window.closed .chat-messages,
  .chat-window.closed .typing-indicator,
  .chat-window.closed .chat-input-container,
  .chat-window.closed .recording-area,
  .chat-window.closed .audio-preview {
    display: none !important;
  }
  
  /* Show logo when closed */
  .chat-window.closed .widget-icon-closed {
    display: block;
    width: 32px;
    height: 32px;
  }
  
  .chat-window.closed .widget-icon-closed:empty,
  .chat-window.closed .widget-icon-closed.error {
    display: none;
  }
  
  .chat-window.closed .widget-icon-fallback {
    display: block;
    font-size: 28px;
  }
  
  .chat-window.closed .widget-icon-closed:not(:empty):not(.error) + .widget-icon-fallback {
    display: none;
  }
  
  .widget-icon-closed,
  .widget-icon-fallback {
    display: none;
  }
  
  .chat-header {
    background: var(--tfw-header-bg, var(--tfw-primary-color, #2563eb));
    color: var(--tfw-header-title-color, var(--tfw-header-color, #ffffff));
    padding: var(--tfw-spacing-md, 12px) var(--tfw-spacing-lg, 16px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 60px;
    box-sizing: border-box;
    flex-shrink: 0; /* Prevent shrinking */
  }
  
  .chat-title {
    font-weight: 600;
    /* 14px, como el título del widget de la app. Era 1rem: 16px, y más en una
       web con la letra base grande. */
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: var(--tfw-spacing-sm, 8px);
  }
  .chat-title svg, .chat-title img {
    width: var(--tfw-header-icon-size, 20px);
    height: var(--tfw-header-icon-size, 20px);
  }
  
  .bot-image {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background: white;
  }
  
  .chat-controls {
    display: flex;
    gap: var(--tfw-spacing-sm, 8px);
  }
  
  .control-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: var(--tfw-header-color, #ffffff);
    width: 32px;
    height: 32px;
    border-radius: var(--tfw-border-radius-small, 6px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  
  .control-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .chat-messages {
    flex: 1;
    padding: var(--tfw-spacing-lg, 16px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--tfw-spacing-md, 12px);
    background-color: var(--tfw-chat-body-bg, #f9fafb);
  }
  
  .message {
    padding: var(--tfw-message-padding, 12px 16px);
    border-radius: var(--tfw-border-radius, 12px);
    word-wrap: break-word;
    font-size: var(--tfw-font-size-message, 12.8px);
    line-height: 1.5;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  @keyframes messageSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .message.user {
    background: var(--tfw-user-message-bg, var(--tfw-primary-color, #2563eb));
    color: var(--tfw-user-message-text-color, var(--tfw-user-message-color, #ffffff));
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  
  .message.bot {
    background: var(--tfw-bot-message-bg, var(--tfw-secondary-color, #f3f4f6));
    color: var(--tfw-bot-message-text-color, var(--tfw-bot-message-color, #1f2937));
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  .typing-indicator {
    display: none;
    align-items: center;
    gap: var(--tfw-spacing-sm, 8px);
    padding: var(--tfw-spacing-md, 12px) var(--tfw-spacing-lg, 16px);
    color: #666;
    font-style: italic;
    font-size: var(--tfw-font-size-sm, 12px);
    margin-left: var(--tfw-spacing-lg, 16px);
  }
  
  .typing-indicator.show {
    display: flex;
  }
  
  .typing-dots {
    display: flex;
    gap: 4px;
  }
  
  .typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    animation: typingDot 1.4s infinite ease-in-out;
  }
  
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typingDot {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--tfw-spacing-sm, 8px);
    margin-top: var(--tfw-spacing-sm, 8px);
  }
  
  .suggestion-chip {
    background: white;
    color: var(--tfw-primary-color);
    border: 1px solid var(--tfw-primary-color);
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    font-size: var(--tfw-font-size-sm, 12px);
    transition: all 0.2s;
    font-weight: 500;
  }
  
  .suggestion-chip:hover {
    background: var(--tfw-primary-color);
    color: white;
    transform: translateY(-1px);
  }
  
  .chat-input-container {
    padding: var(--tfw-spacing-md, 12px);
    border-top: 1px solid var(--tfw-border-color, #e5e7eb);
    background: white;
    flex-shrink: 0; /* Prevent shrinking */
  }
  
  .normal-input {
    display: flex;
    gap: var(--tfw-spacing-sm, 8px);
    align-items: flex-end;
  }
  
  .chat-input {
    flex: 1;
    border: 1px solid var(--tfw-border-color, #e5e7eb);
    border-radius: 20px;
    padding: 10px 14px;
    font-size: var(--tfw-font-size-message, 12.8px);
    outline: none;
    resize: none;
    min-height: 40px;
    max-height: 120px;
    overflow-y: auto;
    font-family: var(--tfw-font-family);
    color: var(--tfw-text-color);
    background: #f9fafb;
    transition: border-color 0.2s, background 0.2s;
  }
  
  .chat-input:focus {
    border-color: var(--tfw-primary-color);
    background: white;
  }
  
  .input-btn {
    background: var(--tfw-primary-color, #2563eb);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .input-btn:hover {
    filter: brightness(1.15);
    transform: scale(1.05);
  }

  /* El icono toma el color del botón. Estaba clavado en blanco, y como más
     abajo ("Input Buttons Harmonization") el botón pasó a fondo transparente,
     quedaba blanco sobre blanco: se veía el círculo con su borde y ningún
     icono dentro. La regla del svg gana por especificidad a la del botón, así
     que el color del botón no llegaba a aplicarse nunca. */
  .input-btn svg {
    color: inherit;
  }
  
  .send-btn {
    background: var(--tfw-primary-color, #2563eb);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .send-btn:hover {
    filter: brightness(1.15);
    transform: scale(1.05);
  }
  
  .send-btn:disabled {
    opacity: 1;
    cursor: pointer;
    transform: none;
  }
  
  .file-input {
    display: none;
  }
  
  /* Rich Components Styles */
  
  /* Card */
  .rich-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 8px;
    border: 1px solid #e5e7eb;
    max-width: 100%;
  }
  
  .rich-card-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .rich-image-standalone {
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;
    border-radius: 4px;
  }
  
  .rich-card-content {
    padding: 12px;
  }
  
  .rich-card-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 4px;
    color: #111827;
  }
  
  .rich-card-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  .rich-card-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.4;
  }
  
  .rich-card-actions {
    padding: 8px 12px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  /* Carousel */
  .rich-carousel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    overflow: hidden;
  }
  
  .carousel-container {
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
  }
  
  .carousel-track-container {
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    width: 100%;
    border-radius: 8px;
    cursor: grab; /* Add grab cursor */
  }

  .carousel-track-container.active {
    cursor: grabbing; /* Add grabbing cursor when active */
    scroll-behavior: auto; /* Disable smooth scroll during drag for responsiveness */
  }
  
  .carousel-track-container::-webkit-scrollbar {
    display: none;
  }
  
  .carousel-track {
    display: flex;
    gap: 12px;
    padding: 4px;
    /* Prevent text selection during drag */
    user-select: none;
    -webkit-user-select: none;
  }
  
  .carousel-item {
    min-width: 260px;
    max-width: 260px;
    flex-shrink: 0;
    /* Prevent image dragging ghost */
    pointer-events: auto; 
  }
  
  .carousel-item img {
    pointer-events: none; /* Prevent image drag */
  }
  
  .carousel-nav:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Video */
  .rich-video {
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    background: black;
  }
  
  .rich-video iframe, .rich-video video {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    border: none;
    display: block;
    max-height: 300px;
  }
  
  /* Audio */
  .rich-audio {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }
  
  .audio-control {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--tfw-primary-color);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }
  
  .audio-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }
  
  .audio-title {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .audio-waveform {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 24px;
    width: 100%;
    opacity: 0.6;
  }

  .waveform-bar {
    flex: 1;
    background: var(--tfw-primary-color);
    border-radius: 2px;
    min-width: 2px;
  }

  .audio-duration {
    font-size: 11px;
    color: #6b7280;
    text-align: right;
  }
  
  /* Location */
  .rich-location {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    background: white;
  }
  
  .location-map {
    width: 100%;
    height: 150px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    position: relative;
  }
  
  .location-map img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .location-info {
    padding: 12px;
  }
  
  .location-name {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .location-address {
    font-size: 12px;
    color: #6b7280;
  }

  /* File (Redesigned to match Audio) */
  .rich-file {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 8px;
    text-decoration: none;
    color: inherit;
    transition: background 0.2s;
  }
  
  .rich-file:hover {
    background: #f9fafb;
  }
  
  .file-icon-container {
    width: 40px;
    height: 40px;
    background: #f3f4f6;
    color: #4b5563;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .file-info {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .file-name {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1f2937;
  }
  
  .file-size {
    font-size: 12px;
    color: #6b7280;
  }

  .file-download-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: transparent;
    color: var(--tfw-primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s;
    flex-shrink: 0;
    border: 1px solid #e5e7eb;
  }

  .file-download-btn:hover {
    background: #eff6ff;
    border-color: var(--tfw-primary-color);
  }
  
  /* Quick Replies (Chips) */
  .quick-replies-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .suggestion-chip {
    background: white;
    border: 1px solid var(--tfw-primary-color);
    color: var(--tfw-primary-color);
    padding: 6px 16px;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .suggestion-chip:hover {
    background: #eff6ff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  /* Acordeón */
  .rich-accordion {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
  }

  .rich-accordion-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    overflow: hidden;
  }

  .rich-accordion-title {
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rich-accordion-title::-webkit-details-marker { display: none; }

  .rich-accordion-title::after {
    content: '⌄';
    font-size: 16px;
    line-height: 1;
    color: var(--tfw-primary-color);
    transition: transform 0.2s;
  }

  .rich-accordion-item[open] .rich-accordion-title::after {
    transform: rotate(180deg);
  }

  .rich-accordion-content {
    padding: 0 12px 10px;
    font-size: 13px;
    line-height: 1.5;
    color: #6b7280;
    white-space: pre-wrap;
  }

  /* Desplegable */
  .rich-dropdown {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    padding: 10px 12px;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .rich-dropdown-label {
    font-size: 12px;
    color: #6b7280;
  }

  .rich-dropdown-select {
    width: 100%;
    padding: 8px 10px;
    font-size: 13px;
    font-family: inherit;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  .rich-dropdown-select:focus {
    outline: none;
    border-color: var(--tfw-primary-color);
  }

  .rich-dropdown-send {
    align-self: flex-start;
  }

  /* Divisor */
  .rich-divider {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 12px 0;
  }

  .rich-divider-dashed { border-top-style: dashed; }
  .rich-divider-dotted { border-top-style: dotted; }

  .rich-divider-con-texto {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 12px 0;
    font-size: 12px;
    color: #9ca3af;
  }

  .rich-divider-con-texto::before,
  .rich-divider-con-texto::after {
    content: '';
    flex: 1;
    border-top: 1px solid #e5e7eb;
  }

  .rich-divider-con-texto.rich-divider-dashed::before,
  .rich-divider-con-texto.rich-divider-dashed::after { border-top-style: dashed; }
  .rich-divider-con-texto.rich-divider-dotted::before,
  .rich-divider-con-texto.rich-divider-dotted::after { border-top-style: dotted; }

  /* Paragraph */
  .rich-paragraph {
    /* El tamaño que se elige en el panel. Estaba fijo en 14px, así que el ajuste
       no cambiaba nada en un mensaje enriquecido. */
    font-size: var(--tfw-font-size-message, 12.8px);
    line-height: 1.5;
    color: #374151;
    margin-bottom: 4px; /* Reduced from 8px */
    white-space: pre-wrap;
    padding: 0; /* Ensure no extra padding */
  }

  /* Botones de acción.

     Se parecen a los del widget de la app a propósito: el mismo mensaje se ve
     en los dos sitios y antes no había forma de reconocerlo. Allí son botones
     neutros, en minúsculas y alineados a la izquierda; aquí salían en
     MAYÚSCULAS, centrados y con borde de color. */
  .action-btn, .share-location-btn {
    width: 100%;
    padding: 8px 16px;
    background: #eef1f5;
    border: 1px solid transparent;
    color: #1f2937;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--tfw-font-size-message, 12.8px);
    font-family: inherit;
    text-transform: none;
    transition: all 0.2s;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin-top: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    text-decoration: none;
  }

  .action-btn:hover, .share-location-btn:hover {
    background: #e2e8f0;
  }

  /* Los enlaces van perfilados, como en la app: llevan a otro sitio y conviene
     que no se confundan con los que siguen la conversación aquí dentro. */
  .action-btn.primary, .action-btn.enlace {
    background: white;
    border-color: var(--tfw-primary-color);
    color: var(--tfw-primary-color);
    font-weight: 600;
  }

  .action-btn.primary:hover, .action-btn.enlace:hover {
    background: rgba(0,0,0,0.03);
  }

  /* Este bloque se había quedado sin selector: una declaración suelta y una
     llave de cierre de más, que rompían el parseo de lo que venía detrás. */
  .action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-icon svg {
    width: 18px;
    height: 18px;
  }
  
  /* Recording Area */
  .recording-area {
    padding: 12px;
    background: #fef2f2;
    border-top: 2px solid #ef4444;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .recording-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #dc2626;
    font-weight: 600;
    font-size: 13px;
  }
  
  .recording-controls {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
  
  .control-recording-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .control-recording-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .control-recording-btn.stop-btn {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  
  /* Audio Preview */
  .audio-preview {
    padding: 12px;
    background: #eff6ff;
    border-top: 2px solid #3b82f6;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .preview-controls {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
  
  .hidden {
    display: none !important;
  }
  
  /* Debug Modal */
  .debug-modal {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .debug-modal.show {
    display: flex;
  }

  .debug-modal-content {
    background: white;
    border-radius: 8px;
    width: 100%;
    max-height: 80%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .debug-modal-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
  }

  .debug-modal-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .debug-modal-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 8px;
  }

  .debug-modal-close:hover {
    color: #1f2937;
    background: #e5e7eb;
    border-radius: 4px;
  }

  .debug-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
  }

  .debug-tab {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: #6b7280;
  }

  .debug-tab.active {
    color: var(--tfw-primary-color);
    border-bottom-color: var(--tfw-primary-color);
    background: #eff6ff;
  }

  .debug-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f9fafb;
  }

  .debug-tab-content {
    display: none;
  }

  .debug-tab-content.active {
    display: block;
  }

  .debug-json {
    background: #1f2937;
    color: #e5e7eb;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    overflow-x: auto;
  }

  .debug-copy-btn {
    margin-bottom: 8px;
    padding: 4px 8px;
    font-size: 12px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
  }

  .debug-copy-btn:hover {
    background: #f3f4f6;
  }

  /* Responsive */
  @media (max-width: 480px) {
    :host {
      --tfw-widget-width: 100%;
      --tfw-widget-height: 100%;
      --tfw-widget-position-bottom: 0;
      --tfw-widget-position-right: 0;
      --tfw-border-radius: 0;
    }
    
    .chat-window {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }


  /* Header Subtitle & Title Group */
  .chat-title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .chat-subtitle {
    font-size: 11px;
    opacity: 0.85;
    color: var(--tfw-header-color, #ffffff);
  }

  /* Message Wrappers & Avatars */
  .message-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 85%;
    animation: messageSlide 0.3s ease;
  }
  
  .message-wrapper.user {
    align-self: flex-end;
  }
  
  .message-wrapper.bot {
    align-self: flex-start;
  }
  
  .message-sender-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }
  
  .message-wrapper.user .message-sender-header {
    justify-content: flex-end;
  }
  
  .message-avatar {
    width: var(--tfw-bot-avatar-size, 24px);
    height: var(--tfw-bot-avatar-size, 24px);
    border-radius: 50%;
    background: var(--tfw-bot-avatar-bg, var(--tfw-primary-color));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    overflow: hidden;
  }
  
  .message-avatar.user-avatar {
    background: rgba(0, 0, 0, 0.12);
    color: #4b5563;
  }
  
  .message-sender-name {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
  }
  
  /* Input Buttons Harmonization */
  .input-btn {
    background: transparent;
    border: 1px solid var(--tfw-primary-color, #2563eb);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tfw-primary-color, #2563eb);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .input-btn:hover {
    /* Un tinte del color de la paleta. Era un azul fijo, rgba(37, 99, 235, 0.08),
       que salía igual con cualquier paleta. La primera línea es para los
       navegadores sin color-mix. */
    background: rgba(0, 0, 0, 0.05);
    background: color-mix(in srgb, var(--tfw-primary-color, #2563eb) 10%, transparent);
    transform: scale(1.05);
  }
  
  /* Full Dark Mode Support */
  .chat-window.dark-mode {
    background: #0f172a;
    color: #f1f5f9;
    border: 1px solid #334155;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }
  
  .chat-window.dark-mode .chat-messages {
    background-color: #0f172a;
  }
  
  .chat-window.dark-mode .message.bot {
    background: #1e293b;
    color: #f1f5f9;
    border: 1px solid #334155;
  }
  
  .chat-window.dark-mode .message.user {
    background: var(--tfw-user-message-bg);
    color: var(--tfw-user-message-color);
  }
  
  .chat-window.dark-mode .message-sender-name {
    color: #94a3b8;
  }
  
  .chat-window.dark-mode .message-avatar.user-avatar {
    background: rgba(255, 255, 255, 0.2);
    color: #f1f5f9;
  }
  
  .chat-window.dark-mode .chat-input-container {
    background: #1e293b;
    border-color: #334155;
  }
  
  .chat-window.dark-mode .chat-input {
    background: #0f172a;
    border-color: #334155;
    color: #f1f5f9;
  }
  
  .chat-window.dark-mode .chat-input:focus {
    border-color: var(--tfw-primary-color);
  }
  
  .chat-window.dark-mode .rich-card {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
  }
  
  .chat-window.dark-mode .rich-card-title {
    color: #f1f5f9;
  }
  
  .chat-window.dark-mode .rich-card-subtitle {
    color: #94a3b8;
  }
  
  .chat-window.dark-mode .rich-card-description {
    color: #cbd5e1;
  }
  
  .chat-window.dark-mode .suggestion-chip {
    background: #1e293b;
    border-color: var(--tfw-primary-color);
    color: #f1f5f9;
  }
  
  .chat-window.dark-mode .suggestion-chip:hover {
    background: var(--tfw-primary-color);
    color: white;
  }
`;
