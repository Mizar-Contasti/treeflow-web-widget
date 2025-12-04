/**
 * TreeFlow Widget Loader
 * This script allows easy integration of TreeFlow widget into any website
 */

(function() {
  'use strict';

  // Prevent multiple loads
  if (window.TreeFlowWidgetLoader) {
    return;
  }

  window.TreeFlowWidgetLoader = {
    version: '1.0.0',
    loaded: false
  };

  // Configuration from script tag or global variable
  function getConfig() {
    const scriptTag = document.currentScript || 
                     document.querySelector('script[src*="widget-loader"]') ||
                     document.querySelector('script[data-treeflow-config]');
    
    const globalConfig = window.treeflowConfig || {};
    const scriptConfig = {};

    // Extract config from script tag data attributes
    if (scriptTag) {
      const attributes = scriptTag.attributes;
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (attr.name.startsWith('data-')) {
          const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          scriptConfig[key] = attr.value;
        }
      }
    }

    // Merge configurations (global config takes precedence)
    return Object.assign({
      // Default configuration
      title: 'TreeFlow Chat',
      endpoint: '',
      primaryColor: '#2563eb',
      secondaryColor: '#f3f4f6',
      textColor: '#1f2937',
      position: 'bottom-right',
      autoWelcome: false,
      welcomeMessage: '¡Hola! ¿En qué puedo ayudarte?',
      placeholder: 'Escribe tu mensaje...',
      width: '350px',
      height: '500px',
      zIndex: '1000',
      autoLoad: true
    }, scriptConfig, globalConfig);
  }

  // Load the main widget component
  function loadWidget() {
    return new Promise((resolve, reject) => {
      // Check if custom elements are supported
      if (!window.customElements) {
        reject(new Error('Custom Elements not supported'));
        return;
      }

      // Check if already loaded
      if (window.customElements.get('treeflow-widget')) {
        resolve();
        return;
      }

      // Load the widget script
      const script = document.createElement('script');
      const baseUrl = getBaseUrl();
      script.src = baseUrl + 'treeflow-widget.js';
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load TreeFlow widget'));
      };

      document.head.appendChild(script);
    });
  }

  // Get base URL for loading scripts
  function getBaseUrl() {
    const scriptTag = document.currentScript || 
                     document.querySelector('script[src*="widget-loader"]');
    
    if (scriptTag && scriptTag.src) {
      return scriptTag.src.replace(/[^/]*$/, '');
    }
    
    // Fallback to same directory
    return './';
  }

  // Create and mount the widget
  function mountWidget(config) {
    // Remove existing widget if any
    const existingWidget = document.querySelector('treeflow-widget');
    if (existingWidget) {
      existingWidget.remove();
    }

    // Create new widget element
    const widget = document.createElement('treeflow-widget');
    
    // Set attributes from config
    Object.keys(config).forEach(key => {
      if (config[key] !== undefined && config[key] !== null) {
        const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        widget.setAttribute(attrName, config[key]);
      }
    });

    // Append to body
    document.body.appendChild(widget);

    // Store reference globally
    window.treeflowWidget = widget;

    return widget;
  }

  // Initialize the widget
  function init() {
    if (window.TreeFlowWidgetLoader.loaded) {
      return;
    }

    const config = getConfig();

    // Load and mount widget
    loadWidget()
      .then(() => {
        const widget = mountWidget(config);
        window.TreeFlowWidgetLoader.loaded = true;
        
        // Dispatch loaded event
        const event = new CustomEvent('treeflow-widget-loaded', {
          detail: { widget, config }
        });
        window.dispatchEvent(event);

        console.log('TreeFlow Widget loaded successfully');
      })
      .catch(error => {
        console.error('TreeFlow Widget failed to load:', error);
        
        // Dispatch error event
        const event = new CustomEvent('treeflow-widget-error', {
          detail: { error }
        });
        window.dispatchEvent(event);
      });
  }

  // Auto-initialize when DOM is ready
  function autoInit() {
    const config = getConfig();
    
    if (config.autoLoad === false || config.autoLoad === 'false') {
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Public API
  window.TreeFlowWidgetLoader.init = init;
  window.TreeFlowWidgetLoader.getConfig = getConfig;
  window.TreeFlowWidgetLoader.loadWidget = loadWidget;
  window.TreeFlowWidgetLoader.mountWidget = mountWidget;

  // Auto-initialize
  autoInit();

})();
