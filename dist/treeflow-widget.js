class TreeFlowWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Initialize session with persistence - only generate new if none exists
    this.sessionId = this.getOrCreateSessionId();
    this.isOpen = false;
    this.isMinimized = false;
    this.messages = [];
    this.isTyping = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.messageDebugData = new Map(); // Store debug data per message
  }

  connectedCallback() {
    this.config = this.getConfiguration();
    
    // Validar que tree_id sea obligatorio
    if (!this.config.treeId) {
      console.error('Error: tree_id es obligatorio. Por favor, especifique un tree_id válido.');
      this.showError('Error: tree_id es obligatorio');
      return;
    }
    
    this.render();
    this.setupEventListeners();
    
    // Si hay un evento configurado, enviarlo independientemente del modo debug
    if (this.config.event) {
      setTimeout(() => this.sendStartEvent(this.config.event), 500);
    }
    
    // Enable fullscreen mode if debug is active
    if (this.config.debug) {
      this.classList.add('debug-fullscreen');
      this.open(); // Auto-open in debug mode
      this.hideToggleButtonInDebug(); // Hide toggle button when chat is open
    } else if (this.config.maximizeOnStart) {
      setTimeout(() => this.open(), 100);
    }
  }

  getConfiguration() {
    const globalConfig = window.treeflowConfig || {};
    
    return {
      title: this.getAttribute('title') || globalConfig.title || 'TreeFlow Chat',
      endpoint: this.getAttribute('endpoint') || globalConfig.apiUrl || 'http://localhost:8000/message',
      treeId: this.getAttribute('tree-id') || this.getAttribute('tree_id') || globalConfig.treeId,
      botIcon: this.getAttribute('bot-icon') || globalConfig.botIcon || 'https://cdn.jsdelivr.net/gh/Mizar-Contasti/treeflow-web-widget@main/dist/luna_blanca_vector.svg',
      botImage: this.getAttribute('bot-image') || globalConfig.botImage || '',
      widgetIcon: this.getAttribute('widget-icon') || globalConfig.widgetIcon || '',
      placeholder: this.getAttribute('placeholder') || globalConfig.placeholder || 'Escribe tu mensaje...',
      event: this.getAttribute('event') || globalConfig.event || null,
      maximizeOnStart: this.getAttribute('maximize-on-start') === 'true' || globalConfig.maximizeOnStart || false,
      fileUpload: this.getAttribute('file-upload') === 'true' || globalConfig.fileUpload || false,
      microphone: this.getAttribute('microphone') === 'true' || globalConfig.microphone || false,
      maxFileSize: parseInt(this.getAttribute('max-file-size')) || globalConfig.maxFileSize || 5242880,
      debug: this.getAttribute('debug') === 'true' || globalConfig.debug || false,
      responseDelay: this.getAttribute('response-delay') === 'true' || globalConfig.responseDelay || false,
      responseDelaySeconds: parseInt(this.getAttribute('response-delay-seconds')) || globalConfig.responseDelaySeconds || 1500
    };
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getOrCreateSessionId() {
    // Try to get existing session from widget instance storage
    if (this.persistentSessionId) {
      console.log('Using existing persistent session:', this.persistentSessionId);
      return this.persistentSessionId;
    }
    
    // Generate new session and store it persistently
    const newSessionId = this.generateSessionId();
    this.persistentSessionId = newSessionId;
    console.log('Created new persistent session:', newSessionId);
    return newSessionId;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
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
          --tfw-font-size-message: 0.8rem;
          
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
          --tfw-widget-width: 350px;
          --tfw-widget-height: 500px;
          --tfw-widget-z-index: 1000;
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
          
          
          position: fixed;
          bottom: var(--tfw-widget-position-bottom);
          right: var(--tfw-widget-position-right);
          z-index: var(--tfw-widget-z-index);
          font-family: var(--tfw-font-family);
        }
        
        /* Debug fullscreen mode */
        :host(.debug-fullscreen) {
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 99999 !important;
        }
        
        :host(.debug-fullscreen) .chat-window {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          border-radius: 0 !important;
          position: static !important;
        }
        
        /* En modo debug, ocultar el botón toggle por defecto */
        :host(.debug-fullscreen) .toggle-btn {
          display: none !important;
        }
        
        /* Solo mostrar cuando el chat está cerrado (no tiene clase 'open') */
        :host(.debug-fullscreen) .chat-window:not(.open) + .toggle-btn,
        :host(.debug-fullscreen):not(:has(.chat-window.open)) .toggle-btn {
          display: block !important;
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          z-index: 100000 !important;
          background: var(--tfw-widget-button-bg) !important;
          color: var(--tfw-widget-button-color) !important;
          border: none !important;
          border-radius: 50% !important;
          width: 60px !important;
          height: 60px !important;
          font-size: 24px !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
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
          transition: var(--tfw-transition);
        }
        
        .widget-button:hover {
          transform: scale(1.1);
        }
        
        .chat-window {
          position: absolute;
          right: 0;
          bottom: calc(var(--tfw-widget-button-size) + 10px);
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
          transition: var(--tfw-transition);
        }
        
        .chat-window.open {
          display: flex;
          transform: scale(1);
          opacity: 1;
        }
        
        .chat-window.minimized {
          height: 60px;
          overflow: hidden;
        }
        
        .chat-header {
          background: var(--tfw-header-bg);
          color: var(--tfw-header-color);
          padding: var(--tfw-spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 60px;
          box-sizing: border-box;
        }
        
        .chat-title {
          font-weight: 600;
          font-size: var(--tfw-font-size-md);
          display: flex;
          align-items: center;
          gap: var(--tfw-spacing-sm);
        }
        
        .bot-image {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
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
          transition: var(--tfw-transition-fast);
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
        }
        
        .message {
          max-width: 80%;
          padding: var(--tfw-spacing-md) var(--tfw-spacing-lg);
          border-radius: var(--tfw-border-radius-large);
          word-wrap: break-word;
          animation: messageSlide 0.3s ease;
          font-size: var(--tfw-font-size-message);
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
        }
        
        .typing-indicator {
          display: none;
          align-items: center;
          gap: var(--tfw-spacing-sm);
          padding: var(--tfw-spacing-md) var(--tfw-spacing-lg);
          color: #666;
          font-style: italic;
          font-size: var(--tfw-font-size-message);
        }
        
        .typing-indicator.show {
          display: flex;
        }
        
        .typing-dots {
          display: flex;
          gap: 4px;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
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
          background: var(--tfw-button-bg);
          color: var(--tfw-button-color);
          border: none;
          padding: var(--tfw-spacing-sm) var(--tfw-spacing-md);
          border-radius: 16px;
          cursor: pointer;
          font-size: var(--tfw-font-size-message);
          transition: var(--tfw-transition-fast);
        }
        
        .suggestion-chip:hover {
          background: var(--tfw-button-hover-bg);
          transform: translateY(-1px);
        }
        
        .chat-input-container {
          padding: var(--tfw-spacing-lg);
          border-top: 1px solid var(--tfw-border-color);
          display: flex;
          align-items: center;
          gap: var(--tfw-spacing-sm);
          flex-wrap: nowrap;
        }
        
        .message-debug-btn {
          background: #6b7280;
          color: white;
          border: none;
          padding: 2px 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 10px;
          margin-left: var(--tfw-spacing-sm);
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .message-debug-btn:hover {
          background: #4b5563;
          opacity: 1;
        }
        
        .debug-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        
        .debug-modal.show {
          display: flex;
        }
        
        .debug-modal-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 800px;
          height: 80%;
          max-height: 600px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .debug-modal-header {
          padding: var(--tfw-spacing-lg);
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }
        
        .debug-modal-title {
          font-weight: bold;
          font-size: 18px;
          color: #333;
          margin: 0;
        }
        
        .debug-modal-close {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .debug-modal-close:hover {
          background: #5a6268;
        }
        
        .debug-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .debug-tab {
          flex: 1;
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        
        .debug-tab:hover {
          background: #e9ecef;
          color: #495057;
        }
        
        .debug-tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background: white;
        }
        
        .debug-modal-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .debug-tab-content {
          flex: 1;
          padding: var(--tfw-spacing-lg);
          overflow-y: auto;
          display: none;
        }
        
        .debug-tab-content.active {
          display: block;
        }
        
        .debug-json {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: var(--tfw-spacing-md);
          font-family: 'Courier New', Monaco, monospace;
          font-size: 12px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-all;
          color: #333;
          height: 100%;
          overflow-y: auto;
        }
        
        .debug-copy-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-bottom: var(--tfw-spacing-sm);
        }
        
        .debug-copy-btn:hover {
          background: #0056b3;
        }
        
        .input-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .input-btn {
          background: var(--tfw-secondary-color);
          border: none;
          min-width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--tfw-transition-fast);
          color: var(--tfw-text-color);
          flex-shrink: 0;
        }
        
        .input-btn:hover {
          background: var(--tfw-button-bg);
          color: var(--tfw-button-color);
        }
        
        .input-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .chat-input {
          flex: 1;
          border: 2px solid var(--tfw-border-color);
          border-radius: var(--tfw-border-radius);
          padding: var(--tfw-spacing-md) var(--tfw-spacing-lg);
          font-size: var(--tfw-font-size-message);
          outline: none;
          resize: none;
          min-height: 36px;
          max-height: 120px;
          overflow-y: hidden;
          font-family: var(--tfw-font-family);
          color: var(--tfw-text-color);
        }
        
        .chat-input:focus {
          border-color: var(--tfw-primary-color);
        }
        
        .send-btn {
          background: var(--tfw-button-bg);
          color: var(--tfw-button-color);
          border: none;
          min-width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--tfw-transition-fast);
        }
        
        .send-btn:hover {
          transform: scale(1.1);
          background: var(--tfw-button-hover-bg);
        }
        
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .file-input {
          display: none;
        }
        
        .recording {
          background: #ef4444 !important;
          animation: recordingPulse 1s infinite;
        }
        
        @keyframes recordingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .hidden {
          display: none !important;
        }
        
        /* Responsive design */
        @media (max-width: 480px) {
          :host {
            --tfw-widget-width: calc(100vw - 40px);
            --tfw-widget-height: calc(100vh - 100px);
            --tfw-widget-position-bottom: 10px;
            --tfw-widget-position-right: 10px;
          }
        }
      </style>
      
      <button class="widget-button" id="toggleBtn">
        ${this.config.widgetIcon || `<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L12.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor" /></svg>`}
      </button>
      
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-title">
            ${this.config.botImage ? `<img src="${this.config.botImage}" class="bot-image" alt="Bot">` : ''}
            ${this.config.title}
          </div>
          <div class="chat-controls">
            <button class="control-btn" id="minimizeBtn" title="Minimizar">−</button>
            <button class="control-btn" id="closeBtn" title="Cerrar">×</button>
          </div>
        </div>
        
        <div class="chat-messages" id="messages"></div>
        
        <div class="typing-indicator" id="typingIndicator">
          <span>Escribiendo</span>
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
        
        <div class="debug-modal" id="debugModal">
          <div class="debug-modal-content">
            <div class="debug-modal-header">
              <h3 class="debug-modal-title">Datos de Sesión</h3>
              <button class="debug-modal-close" id="debugModalClose">Cerrar</button>
            </div>
            
            <div class="debug-tabs">
              <button class="debug-tab active" id="requestTab">Solicitud</button>
              <button class="debug-tab" id="responseTab">Respuesta</button>
            </div>
            
            <div class="debug-modal-body">
              <div class="debug-tab-content active" id="requestContent">
                <button class="debug-copy-btn" id="copyRequestBtn">Copiar Solicitud</button>
                <div class="debug-json" id="requestJson"></div>
              </div>
              
              <div class="debug-tab-content" id="responseContent">
                <button class="debug-copy-btn" id="copyResponseBtn">Copiar Respuesta</button>
                <div class="debug-json" id="responseJson"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <button class="input-btn ${!this.config.fileUpload ? 'hidden' : ''}" id="fileBtn" title="Adjuntar archivo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5,6v11.5c0,2.21-1.79,4-4,4s-4-1.79-4-4V5c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5v10.5c0,0.55-0.45,1-1,1s-1-0.45-1-1V6H10v9.5c0,1.38,1.12,2.5,2.5,2.5s2.5-1.12,2.5-2.5V5c0-2.21-1.79-4-4-4S7,2.79,7,5v12.5c0,3.04,2.46,5.5,5.5,5.5s5.5-2.46,5.5-5.5V6H16.5z"/>
            </svg>
          </button>
          
          <button class="input-btn ${!this.config.microphone ? 'hidden' : ''}" id="micBtn" title="Grabar audio">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,14c1.66,0,3-1.34,3-3V5c0-1.66-1.34-3-3-3S9,3.34,9,5v6C9,12.66,10.34,14,12,14z"/>
              <path d="M17,11c0,2.76-2.24,5-5,5s-5-2.24-5-5H5c0,3.53,2.61,6.43,6,6.92V21h2v-3.08c3.39-0.49,6-3.39,6-6.92H17z"/>
            </svg>
          </button>
          
          <textarea 
            class="chat-input" 
            id="messageInput" 
            placeholder="${this.config.placeholder}"
            rows="1"
          ></textarea>
          
          <button class="send-btn" id="sendBtn" title="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
          
          <input type="file" class="file-input" id="fileInput" accept="*/*">
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const toggleBtn = this.shadowRoot.getElementById('toggleBtn');
    const closeBtn = this.shadowRoot.getElementById('closeBtn');
    const minimizeBtn = this.shadowRoot.getElementById('minimizeBtn');
    const sendBtn = this.shadowRoot.getElementById('sendBtn');
    const messageInput = this.shadowRoot.getElementById('messageInput');
    const fileBtn = this.shadowRoot.getElementById('fileBtn');
    const micBtn = this.shadowRoot.getElementById('micBtn');
    const fileInput = this.shadowRoot.getElementById('fileInput');
    const debugModal = this.shadowRoot.getElementById('debugModal');
    const debugModalClose = this.shadowRoot.getElementById('debugModalClose');
    const requestTab = this.shadowRoot.getElementById('requestTab');
    const responseTab = this.shadowRoot.getElementById('responseTab');
    const requestContent = this.shadowRoot.getElementById('requestContent');
    const responseContent = this.shadowRoot.getElementById('responseContent');
    const copyRequestBtn = this.shadowRoot.getElementById('copyRequestBtn');
    const copyResponseBtn = this.shadowRoot.getElementById('copyResponseBtn');

    toggleBtn.addEventListener('click', () => this.toggle());
    closeBtn.addEventListener('click', () => this.close());
    minimizeBtn.addEventListener('click', () => this.minimize());
    sendBtn.addEventListener('click', () => this.handleSendMessage());
    
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    messageInput.addEventListener('input', () => {
      this.autoResize(messageInput);
    });

    if (this.config.fileUpload) {
      fileBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    if (this.config.microphone) {
      micBtn.addEventListener('click', () => this.handleMicrophone());
    }
    
    if (this.config.debug) {
      debugModalClose.addEventListener('click', () => this.hideDebugModal());
      
      // Tab switching
      requestTab.addEventListener('click', () => this.switchDebugTab('request'));
      responseTab.addEventListener('click', () => this.switchDebugTab('response'));
      
      // Copy buttons
      copyRequestBtn.addEventListener('click', () => this.copyDebugData('request'));
      copyResponseBtn.addEventListener('click', () => this.copyDebugData('response'));
      
      // Close modal when clicking outside
      debugModal.addEventListener('click', (e) => {
        if (e.target === debugModal) {
          this.hideDebugModal();
        }
      });
    }
  }

  autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const chatWindow = this.shadowRoot.getElementById('chatWindow');
    chatWindow.classList.add('open');
    chatWindow.classList.remove('minimized');
    this.isOpen = true;
    this.isMinimized = false;
    
    setTimeout(() => {
      const messageInput = this.shadowRoot.getElementById('messageInput');
      messageInput.focus();
    }, 300);
  }

  close() {
    const chatWindow = this.shadowRoot.getElementById('chatWindow');
    chatWindow.classList.remove('open');
    this.isOpen = false;
    this.isMinimized = false;
    
    // Mostrar el botón flotante cuando se cierra el chat en modo debug
    if (this.config.debug) {
      this.showToggleButtonInDebug();
    }
  }

  minimize() {
    const chatWindow = this.shadowRoot.getElementById('chatWindow');
    if (this.isMinimized) {
      chatWindow.classList.remove('minimized');
      this.isMinimized = false;
      
      // Ocultar el botón flotante cuando se maximiza el chat en modo debug
      if (this.config.debug) {
        this.hideToggleButtonInDebug();
      }
    } else {
      chatWindow.classList.add('minimized');
      this.isMinimized = true;
      
      // Mostrar el botón flotante cuando se minimiza el chat en modo debug
      if (this.config.debug) {
        this.showToggleButtonInDebug();
      }
    }
  }

  async handleSendMessage() {
    const messageInput = this.shadowRoot.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    this.addMessage(message, 'user');
    messageInput.value = '';
    this.autoResize(messageInput);
    
    try {
      this.showTyping();
      
      // Add response delay if configured
      if (this.config.responseDelay && this.config.responseDelaySeconds > 0) {
        await this.delay(this.config.responseDelaySeconds);
      }
      
      const response = await this.callBackend(message);
      this.hideTyping();
      
      if (response.message) {
        // Prepare debug data if debug mode is enabled
        let debugData = null;
        if (this.config.debug) {
          debugData = {
            request: this.pendingRequest,
            response: this.pendingResponse
          };
          console.log('Debug data prepared:', debugData);
        }
        
        this.addMessage(response.message, 'bot', response.suggestions, debugData);
        
        // Clear pending debug data
        this.pendingRequest = null;
        this.pendingResponse = null;
      }
    } catch (error) {
      this.hideTyping();
      console.error('Error sending message:', error);
      this.addMessage('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.', 'bot');
    }
  }

  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > this.config.maxFileSize) {
      this.addMessage(`El archivo es demasiado grande. Tamaño máximo: ${this.formatFileSize(this.config.maxFileSize)}`, 'bot');
      return;
    }
    
    this.addMessage(`📎 Archivo enviado: ${file.name}`, 'user');
    
    try {
      this.showTyping();
      await this.delay(1000);
      this.hideTyping();
      this.addMessage('He recibido tu archivo. ¿En qué puedo ayudarte con él?', 'bot');
    } catch (error) {
      this.hideTyping();
      console.error('Error uploading file:', error);
      this.addMessage('Error al procesar el archivo.', 'bot');
    }
    
    event.target.value = '';
  }

  async handleMicrophone() {
    const micBtn = this.shadowRoot.getElementById('micBtn');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.addMessage('Tu navegador no soporta grabación de audio.', 'bot');
      return;
    }
    
    try {
      if (!this.isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.handleAudioMessage(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        micBtn.classList.add('recording');
        micBtn.title = 'Detener grabación';
        
      } else {
        this.mediaRecorder.stop();
        this.isRecording = false;
        micBtn.classList.remove('recording');
        micBtn.title = 'Grabar audio';
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.addMessage('Error al acceder al micrófono.', 'bot');
    }
  }

  async handleAudioMessage(audioBlob) {
    this.addMessage('🎤 Audio enviado', 'user');
    
    try {
      this.showTyping();
      await this.delay(2000);
      this.hideTyping();
      this.addMessage('He recibido tu mensaje de audio. ¿Podrías escribir tu pregunta?', 'bot');
    } catch (error) {
      this.hideTyping();
      console.error('Error processing audio:', error);
      this.addMessage('Error al procesar el audio.', 'bot');
    }
  }

  async sendStartEvent(eventName) {
    if (!eventName) return;
    
    try {
      const response = await this.callBackendEvent(this.config.event);
      if (response.message) {
        // Prepare debug data if debug mode is enabled
        const debugData = this.config.debug ? {
          request: this.pendingRequest,
          response: this.pendingResponse
        } : null;
        
        this.addMessage(response.message, 'bot', response.suggestions, debugData);
        
        // Clear pending debug data
        this.pendingRequest = null;
        this.pendingResponse = null;
      }
    } catch (error) {
      console.error('Error sending start event:', eventName, error);
    }
  }

  async callBackend(message, isStartEvent = false) {
    this.config = this.getConfiguration();
    
    if (!this.config.endpoint) {
      throw new Error('No endpoint configured');
    }

    const requestPayload = {
      type: 'text',
      value: message.trim(),
      tree_id: this.config.treeId,
      session_id: this.sessionId,
      is_start_event: isStartEvent
    };

    // Store request for debug
    if (this.config.debug) {
      this.pendingRequest = JSON.parse(JSON.stringify(requestPayload)); // Complete request
      console.log('Complete request stored:', this.pendingRequest);
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Store response for debug
    if (this.config.debug) {
      this.pendingResponse = JSON.parse(JSON.stringify(data)); // Complete response
      console.log('Complete response stored:', this.pendingResponse);
    }
    
    return {
      message: data.response?.value || data.message || 'Sin respuesta',
      suggestions: data.suggestions || data.response?.suggestions || []
    };
  }

  async callBackendEvent(eventName) {
    this.config = this.getConfiguration();
    
    if (!this.config.endpoint) {
      throw new Error('No endpoint configured');
    }

    const requestPayload = {
      type: 'event',
      value: eventName,
      tree_id: this.config.treeId,
      session_id: this.sessionId
    };

    console.log('Sending start event:', requestPayload);

    // Store request for debug
    if (this.config.debug) {
      this.pendingRequest = JSON.parse(JSON.stringify(requestPayload)); // Complete request
      console.log('Complete request stored:', this.pendingRequest);
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Store response for debug
    if (this.config.debug) {
      this.pendingResponse = JSON.parse(JSON.stringify(data)); // Complete response
      console.log('Complete response stored:', this.pendingResponse);
    }
    
    return {
      message: data.response?.value || data.message || 'Sin respuesta',
      suggestions: data.suggestions || data.response?.suggestions || []
    };
  }

  addMessage(text, sender, suggestions = [], debugData = null) {
    const messagesContainer = this.shadowRoot.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // Create message content container
    const messageContent = document.createElement('span');
    messageContent.textContent = text;
    messageDiv.appendChild(messageContent);
    
    // Add debug button for bot messages if debug mode is enabled and we have debug data
    if (sender === 'bot' && this.config.debug && debugData) {
      const debugBtn = document.createElement('button');
      debugBtn.className = 'message-debug-btn';
      debugBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2C7.03,2,3,6.03,3,11c0,2.1,0.73,4.03,1.94,5.56l-1.42,1.42C2.73,16.78,2,14.98,2,13c0-5.52,4.48-10,10-10c1.98,0,3.78,0.73,5.19,1.52l-1.42,1.42C14.03,4.73,12.1,4,10,4C6.13,4,3,7.13,3,11c0,1.37,0.41,2.65,1.08,3.75l-1.54,1.54C1.61,14.96,1,13.08,1,11C1,4.92,5.92,0,12,0c2.08,0,3.96,0.61,5.54,1.54l-1.54,1.54C14.65,2.41,13.37,2,12,2z"/>
        <path d="M20.98,11c0-4.97-4.03-9-9-9c-2.1,0-4.03,0.73-5.56,1.94l1.42,1.42C8.73,4.73,10.1,4,12,4c3.87,0,7,3.13,7,7c0,1.37-0.41,2.65-1.08,3.75l1.54,1.54C20.39,14.96,21,13.08,21,11C21,4.92,16.08,0,10,0C7.92,0,6.04,0.61,4.46,1.54l1.54,1.54C7.35,2.41,8.63,2,10,2c4.97,0,9,4.03,9,9c0,2.1-0.73,4.03-1.94,5.56l1.42,1.42C19.27,16.78,20,14.98,20,13c0-5.52-4.48-10-10-10c-1.98,0-3.78,0.73-5.19,1.52l1.42,1.42C7.03,4.73,9.1,4,11,4c3.87,0,7,3.13,7,7c0,1.37-0.41,2.65-1.08,3.75l1.54,1.54C19.39,14.96,20,13.08,20,11z"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>`;
      debugBtn.title = 'Ver debug info';
      
      // Generate unique ID for this message
      const messageId = Date.now() + Math.random();
      this.messageDebugData.set(messageId, debugData);
      
      debugBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDebugModal(messageId);
      });
      
      messageDiv.appendChild(debugBtn);
    }
    
    messagesContainer.appendChild(messageDiv);
    
    if (suggestions && suggestions.length > 0) {
      const suggestionsDiv = document.createElement('div');
      suggestionsDiv.className = 'suggestions';
      
      suggestions.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.textContent = suggestion;
        chip.addEventListener('click', () => {
          const messageInput = this.shadowRoot.getElementById('messageInput');
          messageInput.value = suggestion;
          this.handleSendMessage();
        });
        suggestionsDiv.appendChild(chip);
      });
      
      messagesContainer.appendChild(suggestionsDiv);
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.messages.push({ text, sender, suggestions, timestamp: new Date() });
  }

  showTyping() {
    const typingIndicator = this.shadowRoot.getElementById('typingIndicator');
    typingIndicator.classList.add('show');
    
    const messagesContainer = this.shadowRoot.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typingIndicator = this.shadowRoot.getElementById('typingIndicator');
    typingIndicator.classList.remove('show');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  clearHistory() {
    const messagesContainer = this.shadowRoot.getElementById('messages');
    messagesContainer.innerHTML = '';
    this.messages = [];
  }

  // Public API methods
  sendMessage(message) {
    const messageInput = this.shadowRoot.getElementById('messageInput');
    messageInput.value = message;
    this.handleSendMessage();
  }

  getMessages() {
    return [...this.messages];
  }

  showDebugModal(messageId) {
    const debugModal = this.shadowRoot.getElementById('debugModal');
    const requestJson = this.shadowRoot.getElementById('requestJson');
    const responseJson = this.shadowRoot.getElementById('responseJson');
    const debugData = this.messageDebugData.get(messageId);
    
    console.log('Showing debug modal for messageId:', messageId);
    console.log('Debug data found:', debugData);
    console.log('All stored debug data:', this.messageDebugData);
    
    if (!debugData) {
      requestJson.textContent = 'No hay datos de solicitud disponibles';
      responseJson.textContent = 'No hay datos de respuesta disponibles';
    } else {
      requestJson.textContent = JSON.stringify(debugData.request, null, 2);
      responseJson.textContent = JSON.stringify(debugData.response, null, 2);
    }
    
    // Store current debug data for copying
    this.currentDebugData = debugData;
    
    // Reset to request tab
    this.switchDebugTab('request');
    
    debugModal.classList.add('show');
  }
  
  hideDebugModal() {
    const debugModal = this.shadowRoot.getElementById('debugModal');
    debugModal.classList.remove('show');
    this.currentDebugData = null;
  }
  
  switchDebugTab(tab) {
    const requestTab = this.shadowRoot.getElementById('requestTab');
    const responseTab = this.shadowRoot.getElementById('responseTab');
    const requestContent = this.shadowRoot.getElementById('requestContent');
    const responseContent = this.shadowRoot.getElementById('responseContent');
    
    // Remove active classes
    requestTab.classList.remove('active');
    responseTab.classList.remove('active');
    requestContent.classList.remove('active');
    responseContent.classList.remove('active');
    
    // Add active class to selected tab
    if (tab === 'request') {
      requestTab.classList.add('active');
      requestContent.classList.add('active');
    } else {
      responseTab.classList.add('active');
      responseContent.classList.add('active');
    }
  }
  
  copyDebugData(type) {
    if (!this.currentDebugData) return;
    
    const data = type === 'request' ? this.currentDebugData.request : this.currentDebugData.response;
    const jsonString = JSON.stringify(data, null, 2);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonString).then(() => {
        console.log(`${type} copiado al portapapeles`);
      }).catch(err => {
        console.error('Error copiando al portapapeles:', err);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = jsonString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log(`${type} copiado al portapapeles (fallback)`);
    }
  }
  
  showError(message) {
    // Crear un elemento de error visible en el widget
    const errorElement = document.createElement('div');
    errorElement.className = 'treeflow-widget-error';
    errorElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #f44336;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: sans-serif;
      max-width: 300px;
    `;
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    
    // Eliminar después de 10 segundos
    setTimeout(() => {
      if (document.body.contains(errorElement)) {
        document.body.removeChild(errorElement);
      }
    }, 10000);
  }
  
  hideToggleButtonInDebug() {
    if (!this.config.debug) return;
    
    const toggleBtn = this.shadowRoot.getElementById('toggleBtn');
    if (toggleBtn) {
      toggleBtn.style.display = 'none';
      toggleBtn.style.visibility = 'hidden';
      toggleBtn.style.opacity = '0';
    }
  }
  
  showToggleButtonInDebug() {
    if (!this.config.debug) return;
    
    const toggleBtn = this.shadowRoot.getElementById('toggleBtn');
    if (toggleBtn) {
      toggleBtn.style.display = 'block';
      toggleBtn.style.visibility = 'visible';
      toggleBtn.style.opacity = '1';
      toggleBtn.style.position = 'fixed';
      toggleBtn.style.top = '20px';
      toggleBtn.style.right = '20px';
      toggleBtn.style.zIndex = '100000';
    }
  }
}

// Register the custom element only if not already registered
if (!customElements.get('treeflow-widget')) {
  customElements.define('treeflow-widget', TreeFlowWidget);
}
