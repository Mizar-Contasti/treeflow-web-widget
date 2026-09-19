# 🤖 TreeFlow Web Widget

Widget de chat embebible para TreeFlow - **Integración en 2 líneas de código**

## ⚡ Integración Súper Simple

```html
<!-- Cargar desde CDN gratuito -->
<script src="https://cdn.jsdelivr.net/gh/Mizar-Contasti/treeflow-web-widget@main/dist/treeflow-widget.js"></script>
<treeflow-widget 
  endpoint="http://localhost:8000/message"
  tree-id="6c295eca-5a9f-4588-b1db-1cf5c05f05ee"
  title="Mi Asistente"
  primary-color="#2563eb">
</treeflow-widget>
```

**¡Eso es todo!** 🎉 El widget aparecerá automáticamente como un botón flotante.

## 🔧 Configuración de Endpoint

### Para Desarrollo (localhost):
```html
<treeflow-widget endpoint="http://localhost:8000/message">
```

### Para Producción:
```html
<treeflow-widget endpoint="https://tu-backend.com/message">
```

## 📋 Todas las Opciones

```html
<treeflow-widget 
  endpoint="http://localhost:8000/message"          <!-- URL de tu TreeFlow backend -->
  tree-id="6c295eca-5a9f-4588-b1db-1cf5c05f05ee"   <!-- ID de tu bot específico -->
  title="Mi Chatbot"                                <!-- Título del widget -->
  primary-color="#2563eb"                           <!-- Color principal -->
  position="bottom-right"                           <!-- Posición: bottom-right, bottom-left -->
  auto-welcome="true"                               <!-- Mostrar mensaje de bienvenida -->
  welcome-message="¡Hola! ¿En qué puedo ayudarte?"  <!-- Mensaje personalizado -->
  placeholder="Escribe tu mensaje..."               <!-- Placeholder del input -->
  width="350px"                                     <!-- Ancho del widget -->
  height="500px">                                   <!-- Alto del widget -->
</treeflow-widget>
```

## 🎯 Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Sitio Web con TreeFlow</title>
</head>
<body>
    <h1>Bienvenido a mi sitio web</h1>
    <p>Contenido de tu página...</p>

    <!-- TreeFlow Widget - Solo estas 2 líneas -->
    <script src="https://cdn.jsdelivr.net/gh/Mizar-Contasti/treeflow-web-widget@main/dist/treeflow-widget.js"></script>
    <treeflow-widget 
      endpoint="http://localhost:8000/message"
      tree-id="6c295eca-5a9f-4588-b1db-1cf5c05f05ee"
      title="Asistente Virtual"
      primary-color="#2563eb"
      auto-welcome="true">
    </treeflow-widget>
</body>
</html>
```

## 🚀 Características

- ✅ **CDN gratuito** - jsDelivr sirve el archivo automáticamente
- ✅ **Integración en 2 líneas** - Solo script + custom element  
- ✅ **Web Component nativo** - Sin conflictos CSS
- ✅ **Conecta con TreeFlow** - API nativa compatible
- ✅ **Totalmente personalizable** - Colores, posición, mensajes
- ✅ **Responsive** - Se adapta a móviles automáticamente
- ✅ **Sugerencias interactivas** - Chips de respuesta rápida
- ✅ **Sesiones persistentes** - Mantiene historial del chat

## 📦 Archivos del Repositorio

```
treeflow-web-widget/
├── dist/
│   └── treeflow-widget.js    # Widget listo para producción (20KB)
├── README.md                 # Esta documentación
└── package.json             # Metadatos del paquete
```

## 🔄 Cambiar de Desarrollo a Producción

1. **Durante desarrollo**: `endpoint="http://localhost:8000/message"`
2. **En producción**: Cambia a `endpoint="https://tu-backend.com/message"`

## 📞 Soporte

Para reportar problemas o solicitar nuevas características, abre un issue en este repositorio.

---

**Desarrollado para TreeFlow** - Chatbots inteligentes y fáciles de integrar 🤖

## 📦 Instalación

### Opción 1: CDN (Recomendado)

```html
<!-- Carga automática con configuración en atributos -->
<script src="https://tu-cdn.com/widget-loader.js" 
        data-title="Mi Chatbot"
        data-endpoint="https://tu-backend.com/api/chat"
        data-primary-color="#2563eb"
        data-position="bottom-right"></script>
```

### Opción 2: Configuración Global

```html
<script>
  window.treeflowConfig = {
    title: "Mi Asistente Virtual",
    endpoint: "https://tu-backend.com/api/chat",
    primaryColor: "#2563eb",
    position: "bottom-right",
    autoWelcome: true,
    welcomeMessage: "¡Hola! ¿En qué puedo ayudarte?"
  };
</script>
<script src="https://tu-cdn.com/widget-loader.js"></script>
```

### Opción 3: Web Component Directo

```html
<script src="https://tu-cdn.com/treeflow-widget.js"></script>
<treeflow-widget 
  title="Mi Chatbot"
  endpoint="https://tu-backend.com/api/chat"
  primary-color="#2563eb"
  position="bottom-right">
</treeflow-widget>
```

## ⚙️ Opciones de Configuración

| Opción | Tipo | Valor por Defecto | Descripción |
|--------|------|-------------------|-------------|
| `title` | string | "TreeFlow Chat" | Título mostrado en el header del widget |
| `endpoint` | string | "" | URL del backend de TreeFlow |
| `primary-color` | string | "#2563eb" | Color principal del widget |
| `secondary-color` | string | "#f3f4f6" | Color de fondo de mensajes del bot |
| `text-color` | string | "#1f2937" | Color del texto |
| `bot-icon` | string | null | URL del icono del bot (opcional) |
| `position` | string | "bottom-right" | Posición: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `auto-welcome` | boolean | false | Enviar mensaje de bienvenida automáticamente |
| `welcome-message` | string | "¡Hola! ¿En qué puedo ayudarte?" | Mensaje de bienvenida |
| `placeholder` | string | "Escribe tu mensaje..." | Placeholder del input |
| `width` | string | "350px" | Ancho del widget |
| `height` | string | "500px" | Alto del widget |
| `z-index` | string | "1000" | Z-index para posicionamiento |

## 📡 API del Backend

El widget se comunica con tu backend mediante peticiones POST. Tu endpoint debe responder en el siguiente formato:

### Petición

```json
POST /api/chat
Content-Type: application/json

{
  "message": "Hola, ¿qué puedes hacer?",
  "sessionId": "session_abc123_1234567890",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Respuesta

```json
{
  "message": "¡Hola! Soy tu asistente virtual. Puedo ayudarte con información sobre productos, soporte técnico y más.",
  "suggestions": ["Ver productos", "Contactar soporte", "Preguntas frecuentes"]
}
```

### Campos de Respuesta

- **message** (string, requerido): El mensaje de respuesta del bot
- **suggestions** (array, opcional): Lista de sugerencias para respuesta rápida

## 🎨 Personalización Avanzada

### Variables CSS

Si necesitas personalización más avanzada, puedes sobrescribir las variables CSS:

```css
treeflow-widget {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --text-color: #your-color;
  --widget-width: 400px;
  --widget-height: 600px;
}
```

### Eventos JavaScript

El widget emite eventos personalizados que puedes escuchar:

```javascript
// Widget cargado
window.addEventListener('treeflow-widget-loaded', (event) => {
  console.log('Widget loaded:', event.detail.widget);
});

// Error al cargar
window.addEventListener('treeflow-widget-error', (event) => {
  console.error('Widget error:', event.detail.error);
});
```

## 🔧 API Programática

Una vez cargado, puedes controlar el widget programáticamente:

```javascript
const widget = window.treeflowWidget;

// Abrir el chat
widget.open();

// Cerrar el chat
widget.close();

// Enviar mensaje como usuario
widget.sendUserMessage("Hola");

// Limpiar historial
widget.clearHistory();
```

## 🏗️ Desarrollo Local

### Prerrequisitos

- Node.js 16+
- npm o yarn

### Instalación

```bash
git clone https://github.com/treeflow/web-widget.git
cd treeflow-web-widget
npm install
```

### Comandos de Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Build en modo watch
npm run build:watch

# Limpiar dist
npm run clean
```

### Estructura del Proyecto

```
treeflow-web-widget/
├── src/
│   ├── treeflow-widget.js    # Web Component principal
│   └── widget-loader.js      # Script de carga automática
├── demo/
│   └── index.html           # Página de demostración
├── dist/                    # Archivos compilados
├── webpack.config.js        # Configuración de Webpack
└── package.json
```

## 🧱 Bloque HTML

Un bloque `{ "type": "html", "items": [{ "html": "..." }] }` pinta HTML dentro del chat, igual que el widget de la app. El contenido puede ser:

- HTML escrito a mano (`<h3>`, `<p>`, `<blockquote>`, `<img>`, `<a>`, listas, tablas…).
- Una variable de sesión que devolvió una herramienta o una API: HTML, o un JSON (objeto o lista, también dentro de `data`, `items`, `noticias` o `key_value`) cuyas filas llevan `title`, `image` y `content`/`html`/`excerpt`. Cada fila se pinta como un fragmento y se separan con una línea.

Una respuesta del motor de tipo `html` se entrega como este mismo bloque.

Todo pasa por [DOMPurify](https://github.com/cure53/DOMPurify) antes de pintarse: no llegan `script`, `iframe`, `object`, `embed`, `form` ni `input`, ni atributos `on*`. Los enlaces se abren en una pestaña nueva con `rel="noopener noreferrer"`.

## 🌐 Compatibilidad

- **Navegadores**: Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+
- **Móviles**: iOS Safari 10.3+, Chrome Mobile 54+
- **Tecnologías**: Web Components, Shadow DOM, ES6+

## 📱 Responsive Design

El chat tiene tres estados: **cerrado** (sólo el icono), **abierto** (ventana flotante) y **maximizado** (ocupa todo el viewport). Según el ancho de la pantalla:

- **Desktop** (más ancho que el corte de tablet): ventana flotante con el tamaño configurado. El botón de maximizar es opcional.
- **Tablet** (hasta el corte de tablet, 1024 px por defecto): ventana flotante que no desborda la pantalla (como máximo el 88 % del ancho y el 82 % del alto). El botón de maximizar es opcional.
- **Móvil** (hasta el corte móvil, 640 px por defecto): sólo hay dos estados, cerrado o a pantalla completa. Al tocar el icono, el chat ocupa todo el ancho y el alto del viewport, y **no hay botón de maximizar**.

Estos ajustes llegan por la configuración remota (`GET /widget-config/{tree-id}`), que se edita en la pestaña *Responsive* del panel; también valen en `window.treeflowConfig`:

| Clave | Por defecto | Qué hace |
|---|---|---|
| `maximizeDesktop`, `maximizeTablet` | ver abajo | Muestra el botón de maximizar en ese dispositivo |
| `minimizeDesktop`, `minimizeTablet`, `minimizeMobile` | `true`, `true`, `false` | Botón de minimizar: vuelve al icono del lanzador |
| `closeDesktop`, `closeTablet`, `closeMobile` | `false`, `false`, `false` | Botón de cerrar: **elimina el chat de la página**, con su icono, hasta que se recargue |
| `mobileAutoFullscreen` | `true` | Abre a pantalla completa en móvil. Apagado, se abre como ventana flotante |
| `mobileBreakpoint` | `640` | Ancho máximo (px) que se considera teléfono |
| `tabletBreakpoint` | `1024` | Ancho máximo (px) que se considera tablet |
| `tabletAutoFit` | `true` | Recorta la ventana para que quepa en tablet |
| `tabletWidth`, `tabletHeight` | `widgetWidth`, `widgetHeight` | Tamaño de la ventana en tablet |

Sin `maximizeDesktop`/`maximizeTablet`, manda la configuración anterior: `enableMaximize` (o el atributo `enable-maximize`) y, si existe, `maximizeVisibility`. Sin ninguna de las dos, el botón aparece en desktop y tablet. `enable-maximize="false"` lo apaga en todos.

Tocar la franja de la cabecera (el título, el subtítulo o cualquier zona que no sea un botón) **minimiza el chat en cualquier dispositivo**, esté o no activado el botón de minimizar. Un toque sobre un botón lo atiende el botón. Así el visitante siempre tiene salida, aunque minimizar y cerrar estén desactivados (el valor por defecto en móvil).

### Animación de abrir y cerrar

Al tocar el icono el chat se abre con una animación, y al minimizarlo vuelve al icono con otra. Cada dispositivo tiene la suya:

| Dispositivo | Abrir | Cerrar | Duración (abrir / cerrar) |
|---|---|---|---|
| **Desktop** | La ventana crece desde la esquina del icono | Se encoge hacia ella | 200 / 150 ms |
| **Tablet** | Sube desde abajo con un desvanecido | Baja y se desvanece | 240 / 180 ms |
| **Móvil** | La pantalla completa se desliza desde abajo, como una hoja | Se desliza hacia abajo | 300 / 240 ms |

El icono reaparece con un pequeño rebote al cerrar. La primera apertura de la página (*Abrir al iniciar*) no se anima. Quien tiene activado "reducir movimiento" en su sistema (`prefers-reduced-motion`) no ve ninguna animación. Al cerrar, la ventana sigue en pantalla mientras dura la animación y sólo entonces desaparece.

El tamaño se reevalúa al redimensionar o girar el dispositivo. Un chat que se abrió a pantalla completa por ser un teléfono vuelve a ventana si la pantalla pasa a ser de tablet o de escritorio.

## 🔒 Consideraciones de Seguridad

- **CORS**: Asegúrate de configurar CORS en tu backend
- **HTTPS**: Recomendado para producción
- **Validación**: Valida todas las entradas en tu backend
- **Rate Limiting**: Implementa límites de velocidad en tu API

## 🚀 Despliegue

### CDN Recomendado

1. Sube los archivos `dist/treeflow-widget.js` y `dist/widget-loader.js` a tu CDN
2. Configura headers de cache apropiados
3. Habilita compresión gzip/brotli

### Ejemplo con Netlify

```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

### Ejemplo con Vercel

```bash
npm run build
# Configura vercel.json para servir archivos estáticos
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Documentación**: [docs.treeflow.ai](https://docs.treeflow.ai)
- **Issues**: [GitHub Issues](https://github.com/treeflow/web-widget/issues)
- **Email**: support@treeflow.ai

## 🎯 Roadmap

- [x] **Grabación de voz con STT** - Transcripción automática de audio
- [x] **Soporte para archivos adjuntos** - Upload de archivos
- [ ] Temas predefinidos
- [ ] Integración con Google Analytics
- [ ] Modo offline
- [ ] Notificaciones push
- [ ] Múltiples idiomas
- [ ] Respuestas enriquecidas (carousels, cards, etc.)

## 🎤 Funcionalidad de Voz (STT)

El widget ahora soporta **grabación de voz con transcripción automática**:

### **Configuración:**
```html
<treeflow-widget 
  microphone="true"
  endpoint="http://localhost:8000/message">
</treeflow-widget>
```

### **Requisitos:**
- Backend TreeFlow con servicio de voz habilitado
- STT habilitado en la configuración del árbol
- Árbol entrenado

### **Flujo:**
1. Usuario hace clic en el botón de micrófono 🎤
2. Grabación de audio inicia (botón se pone rojo)
3. Usuario hace clic de nuevo para detener
4. Audio se envía automáticamente a `/voice/stt`
5. Texto transcrito se muestra como mensaje del usuario
6. Texto se envía automáticamente al bot
7. Respuesta del bot se muestra

### **Endpoints:**
- **STT:** `POST /voice/stt` - Transcripción de audio
- **Message:** `POST /message` - Respuesta del bot

---

Hecho con ❤️ por el equipo de TreeFlow
