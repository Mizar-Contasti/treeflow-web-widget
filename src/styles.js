export const WIDGET_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after {
    font-family: var(--tfw-font-family);
    box-sizing: border-box;
  }
  
  :host {
    /* Variables CSS para personalización completa */
    --tfw-primary-color: #2563eb;
    --tfw-secondary-color: #f3f4f6;
    --tfw-text-color: #1f2937;
    --tfw-background-color: #ffffff;
    --tfw-border-color: #e5e7eb;
    --tfw-shadow-color: rgba(0, 0, 0, 0.12);
    --tfw-font-family: 'Open Sans', sans-serif;
    
    /* Tamaños de fuente */
    --tfw-font-size: 14px;
    --tfw-font-size-sm: 0.8rem;
    --tfw-font-size-md: 1rem;
    --tfw-font-size-lg: 1.125rem;
    --tfw-font-size-message: 0.9rem;
    
    /* Colores de mensajes */
    --tfw-user-message-bg: var(--tfw-primary-color);
    --tfw-user-message-color: #ffffff;
    --tfw-bot-message-bg: var(--tfw-secondary-color);
    --tfw-bot-message-color: var(--tfw-text-color);
    
    /* Header */
    --tfw-header-bg: var(--tfw-primary-color);
    --tfw-header-color: #ffffff;
    
    /* Botones */
    --tfw-button-bg: var(--tfw-primary-color);
    --tfw-button-color: #ffffff;
    --tfw-button-hover-bg: #1d4ed8;
    
    /* Widget dimensions */
    --tfw-widget-width: 380px;
    --tfw-widget-height: 600px;
    --tfw-widget-z-index: 10000;
    --tfw-widget-position-bottom: 20px;
    --tfw-widget-position-right: 20px;
    
    /* Widget button */
    --tfw-widget-button-size: 60px;

    --tfw-widget-button-bg: var(--tfw-primary-color);
    --tfw-widget-button-color: #ffffff;
    
    /* Border radius */
    --tfw-border-radius: 12px;
    --tfw-border-radius-small: 6px;
    --tfw-border-radius-large: 18px;
    
    /* Spacing */
    --tfw-spacing-sm: 8px;
    --tfw-spacing-md: 12px;
    --tfw-spacing-lg: 16px;
    
    /* Dark Mode Variables */
    --tfw-bg-dark: #1e1e1e;
    --tfw-surface-dark: #2d2d2d;
    --tfw-text-dark: #e0e0e0;
    --tfw-border-dark: #404040;
    
    position: fixed;
    bottom: var(--tfw-widget-position-bottom);
    right: var(--tfw-widget-position-right);
    z-index: var(--tfw-widget-z-index);
    font-family: var(--tfw-font-family);
  }
  
  .widget-button {
    width: var(--tfw-widget-button-size);
    height: var(--tfw-widget-button-size);
    border-radius: 50%;
    background: var(--tfw-widget-button-bg);
    color: var(--tfw-widget-button-color);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .widget-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  .chat-window {
    position: fixed;
    right: var(--tfw-widget-position-right);
    bottom: var(--tfw-widget-position-bottom);
    width: var(--tfw-widget-width);
    height: var(--tfw-widget-height);
    background: var(--tfw-background-color);
    border-radius: var(--tfw-border-radius);
    box-shadow: 0 8px 32px var(--tfw-shadow-color);
    display: none;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.8);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: var(--tfw-widget-z-index);
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
    right: var(--tfw-widget-position-right);
    bottom: var(--tfw-widget-position-bottom);
    top: auto;
    left: auto;
    width: var(--tfw-widget-width);
    height: var(--tfw-widget-height);
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
    background: var(--tfw-header-bg);
    color: var(--tfw-header-color);
    padding: var(--tfw-spacing-md) var(--tfw-spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 60px;
    box-sizing: border-box;
    flex-shrink: 0; /* Prevent shrinking */
  }
  
  .chat-title {
    font-weight: 600;
    font-size: var(--tfw-font-size-md);
    display: flex;
    align-items: center;
    gap: var(--tfw-spacing-sm);
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
    gap: var(--tfw-spacing-sm);
  }
  
  .control-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: var(--tfw-header-color);
    width: 32px;
    height: 32px;
    border-radius: var(--tfw-border-radius-small);
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
    padding: var(--tfw-spacing-lg);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--tfw-spacing-md);
    background-color: #f9fafb;
  }
  
  .message {
    max-width: 85%;
    padding: 12px 16px; /* Standardized padding */
    border-radius: var(--tfw-border-radius-large);
    word-wrap: break-word;
    animation: messageSlide 0.3s ease;
    font-size: var(--tfw-font-size-message);
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
    background: var(--tfw-user-message-bg);
    color: var(--tfw-user-message-color);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  
  .message.bot {
    background: var(--tfw-bot-message-bg);
    color: var(--tfw-bot-message-color);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  .typing-indicator {
    display: none;
    align-items: center;
    gap: var(--tfw-spacing-sm);
    padding: var(--tfw-spacing-md) var(--tfw-spacing-lg);
    color: #666;
    font-style: italic;
    font-size: var(--tfw-font-size-sm);
    margin-left: var(--tfw-spacing-lg);
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
    gap: var(--tfw-spacing-sm);
    margin-top: var(--tfw-spacing-sm);
  }
  
  .suggestion-chip {
    background: white;
    color: var(--tfw-primary-color);
    border: 1px solid var(--tfw-primary-color);
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    font-size: var(--tfw-font-size-sm);
    transition: all 0.2s;
    font-weight: 500;
  }
  
  .suggestion-chip:hover {
    background: var(--tfw-primary-color);
    color: white;
    transform: translateY(-1px);
  }
  
  .chat-input-container {
    padding: var(--tfw-spacing-md);
    border-top: 1px solid var(--tfw-border-color);
    background: white;
    flex-shrink: 0; /* Prevent shrinking */
  }
  
  .normal-input {
    display: flex;
    gap: var(--tfw-spacing-sm);
    align-items: flex-end;
  }
  
  .chat-input {
    flex: 1;
    border: 1px solid var(--tfw-border-color);
    border-radius: 20px;
    padding: 10px 14px;
    font-size: var(--tfw-font-size-message);
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
  
  .input-btn, .send-btn {
    background: transparent;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .input-btn:hover {
    background: #f3f4f6;
    color: var(--tfw-primary-color);
  }
  
  .send-btn {
    background: var(--tfw-primary-color);
    color: white;
  }
  
  .send-btn:hover {
    background: var(--tfw-button-hover-bg);
    transform: scale(1.05);
  }
  
  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  /* Paragraph */
  .rich-paragraph {
    font-size: 14px;
    line-height: 1.5;
    color: #374151;
    margin-bottom: 4px; /* Reduced from 8px */
    white-space: pre-wrap;
    padding: 0; /* Ensure no extra padding */
  }

  /* Shared Button Styles */
  .action-btn, .share-location-btn {
    width: 100%;
    padding: 8px 16px;
    background: white;
    border: 1px solid var(--tfw-primary-color);
    color: var(--tfw-primary-color);
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    transition: all 0.2s;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
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
`;
