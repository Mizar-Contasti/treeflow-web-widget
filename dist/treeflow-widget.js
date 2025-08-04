class TreeFlowWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.sessionId = this.generateSessionId();
    this.isOpen = false;
    this.isMinimized = false;
    this.messages = [];
    this.isTyping = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  connectedCallback() {
    this.config = this.getConfiguration();
    this.render();
    this.setupEventListeners();
    
    if (this.config.maximizeOnStart) {
      setTimeout(() => this.open(), 100);
    }
    
    if (this.config.startEvents && this.config.startEvents.length > 0) {
      setTimeout(() => this.sendStartEvents(), 500);
    }
    
    if (this.config.autoWelcome && this.config.welcomeMessage) {
      setTimeout(() => this.addMessage(this.config.welcomeMessage, 'bot'), 1000);
    }
  }

  getConfiguration() {
    const globalConfig = window.treeflowConfig || {};
    
    return {
      title: this.getAttribute('title') || globalConfig.title || 'TreeFlow Chat',
      endpoint: this.getAttribute('endpoint') || globalConfig.apiUrl || '',
      treeId: this.getAttribute('tree-id') || this.getAttribute('tree_id') || globalConfig.treeId || '6c295eca-5a9f-4588-b1db-1cf5c05f05ee',
      botIcon: this.getAttribute('bot-icon') || globalConfig.botIcon || '🤖',
      widgetIcon: this.getAttribute('widget-icon') || globalConfig.widgetIcon || '💬',
      autoWelcome: this.getAttribute('auto-welcome') === 'true' || globalConfig.autoWelcome || false,
      welcomeMessage: this.getAttribute('welcome-message') || globalConfig.welcomeMessage || '¡Hola! ¿En qué puedo ayudarte?',
      placeholder: this.getAttribute('placeholder') || globalConfig.placeholder || 'Escribe tu mensaje...',
      startEvents: globalConfig.startEvents || [],
      maximizeOnStart: this.getAttribute('maximize-on-start') === 'true' || globalConfig.maximizeOnStart || false,
      fileUpload: this.getAttribute('file-upload') === 'true' || globalConfig.fileUpload || false,
      microphone: this.getAttribute('microphone') === 'true' || globalConfig.microphone || false,
      maxFileSize: parseInt(this.getAttribute('max-file-size')) || globalConfig.maxFileSize || 5242880,
      responseDelay: parseInt(this.getAttribute('response-delay')) || globalConfig.responseDelay || 1500
    };
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          /* Variables CSS para personalización completa */
          --tfw-primary-color: #2563eb;
          --tfw-secondary-color: #f3f4f6;
          --tfw-text-color: #1f2937;
          --tfw-background-color: #ffffff;
          --tfw-border-color: #e5e7eb;
          --tfw-shadow-color: rgba(0, 0, 0, 0.12);
          
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
          
          /* Typography */
          --tfw-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --tfw-font-size-sm: 14px;
          --tfw-font-size-md: 16px;
          
          /* Animation */
          --tfw-transition: all 0.3s ease;
          --tfw-transition-fast: all 0.2s ease;
          
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
          font-size: var(--tfw-font-size-sm);
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
          font-size: var(--tfw-font-size-sm);
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
          font-size: var(--tfw-font-size-sm);
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
          align-items: flex-end;
          gap: var(--tfw-spacing-sm);
        }
        
        .input-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .input-btn {
          background: var(--tfw-secondary-color);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: var(--tfw-border-radius-small);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--tfw-transition-fast);
          color: var(--tfw-text-color);
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
          font-size: var(--tfw-font-size-sm);
          outline: none;
          resize: none;
          min-height: 20px;
          max-height: 100px;
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
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
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
        ${this.config.widgetIcon}
      </button>
      
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-title">
            ${this.config.botIcon ? `<span>${this.config.botIcon}</span>` : ''}
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
        
        <div class="chat-input-container">
          <div class="input-actions">
            <button class="input-btn ${!this.config.fileUpload ? 'hidden' : ''}" id="fileBtn" title="Adjuntar archivo">📎</button>
            <button class="input-btn ${!this.config.microphone ? 'hidden' : ''}" id="micBtn" title="Grabar audio">🎤</button>
          </div>
          
          <textarea 
            class="chat-input" 
            id="messageInput" 
            placeholder="${this.config.placeholder}"
            rows="1"
          ></textarea>
          
          <button class="send-btn" id="sendBtn" title="Enviar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
  }

  minimize() {
    const chatWindow = this.shadowRoot.getElementById('chatWindow');
    if (this.isMinimized) {
      chatWindow.classList.remove('minimized');
      this.isMinimized = false;
    } else {
      chatWindow.classList.add('minimized');
      this.isMinimized = true;
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
      
      if (this.config.responseDelay > 0) {
        await this.delay(this.config.responseDelay);
      }
      
      const response = await this.callBackend(message);
      this.hideTyping();
      
      if (response.message) {
        this.addMessage(response.message, 'bot', response.suggestions);
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

  async sendStartEvents() {
    for (const event of this.config.startEvents) {
      try {
        await this.callBackend(event, true);
      } catch (error) {
        console.error('Error sending start event:', event, error);
      }
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
    
    return {
      message: data.response?.value || data.message || 'Sin respuesta',
      suggestions: data.suggestions || data.response?.suggestions || []
    };
  }

  addMessage(text, sender, suggestions = []) {
    const messagesContainer = this.shadowRoot.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    
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
}

// Register the custom element only if not already registered
if (!customElements.get('treeflow-widget')) {
  customElements.define('treeflow-widget', TreeFlowWidget);
}
