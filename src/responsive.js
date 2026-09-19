// Lógica responsive del widget: qué dispositivo es el visitante, dónde se ofrece
// el botón de maximizar y qué tamaño tiene la ventana abierta.
//
// Son funciones puras, sin DOM. Deben dar lo mismo que el widget de la app
// (frontend/.../chat-window/hooks/useWidgetResponsive.ts y maximizeDevices.ts);
// si cambia una, cambia la otra. La única diferencia es adrede: una
// configuración vieja sin `maximizeVisibility` tenía el botón en todos los
// dispositivos aquí, y la app la lee como "sólo escritorio".
//
// El chat tiene tres estados —cerrado, abierto y maximizado—, pero en un
// teléfono sólo dos: cerrado o a pantalla completa. Por eso el botón de
// maximizar existe en tablet y escritorio, nunca en móvil.

export const DEFAULT_MOBILE_BREAKPOINT = 640;
export const DEFAULT_TABLET_BREAKPOINT = 1024;

/** 'mobile' hasta el corte móvil, 'tablet' hasta el corte de tablet, 'desktop' el resto. */
export function getDeviceType(width, cfg = {}) {
  const mobile = Number(cfg.mobileBreakpoint) || DEFAULT_MOBILE_BREAKPOINT;
  const tablet = Number(cfg.tabletBreakpoint) || DEFAULT_TABLET_BREAKPOINT;
  if (width <= mobile) return 'mobile';
  if (width <= tablet) return 'tablet';
  return 'desktop';
}

/**
 * En qué dispositivos se ofrece el botón de maximizar.
 *
 * Manda el ajuste por dispositivo (`maximizeDesktop`, `maximizeTablet`) cuando
 * la configuración lo trae. Una configuración anterior sólo trae
 * `enableMaximize` y, a veces, `maximizeVisibility`: se traduce para que el
 * botón siga donde estaba. Sin `maximizeVisibility` el botón estaba en todos los
 * dispositivos, así que aquí queda en escritorio y tablet. Móvil sale siempre
 * en `false`. `enableMaximize: false` explícito lo apaga todo.
 */
export function resolveMaximizeDevices(cfg = {}) {
  const ninguno = { desktop: false, tablet: false, mobile: false };

  if (cfg.enableMaximize === false) return ninguno;

  if (cfg.maximizeDesktop !== undefined || cfg.maximizeTablet !== undefined) {
    return { ...ninguno, desktop: !!cfg.maximizeDesktop, tablet: !!cfg.maximizeTablet };
  }

  switch (cfg.maximizeVisibility) {
    case 'desktop':
      return { ...ninguno, desktop: true };
    case 'mobile_tablet':
      return { ...ninguno, tablet: true };
    default:
      return { ...ninguno, desktop: true, tablet: true };
  }
}

const flag = (valor, porDefecto) => (valor === undefined || valor === null ? porDefecto : !!valor);

/**
 * Qué botones de minimizar y de cerrar hay en cada dispositivo.
 *
 * - Minimizar (vuelve al icono del lanzador): por defecto en desktop y tablet,
 *   no en móvil.
 * - Cerrar (quita el chat de la página): por defecto en ninguno; es destructivo,
 *   así que hay que pedirlo.
 *
 * Lo que la configuración no traiga toma el valor por defecto. Tiene que dar lo
 * mismo que `headerButtons.ts` en la app.
 */
export function resolveHeaderButtons(cfg = {}) {
  return {
    minimize: {
      desktop: flag(cfg.minimizeDesktop, true),
      tablet: flag(cfg.minimizeTablet, true),
      mobile: flag(cfg.minimizeMobile, false),
    },
    close: {
      desktop: flag(cfg.closeDesktop, false),
      tablet: flag(cfg.closeTablet, false),
      mobile: flag(cfg.closeMobile, false),
    },
  };
}

/** ¿Hay que abrir el chat a pantalla completa? Sólo en móvil, y salvo que se haya apagado. */
export function opensFullscreen(deviceType, cfg = {}) {
  return deviceType === 'mobile' && cfg.mobileAutoFullscreen !== false;
}

/**
 * Tamaño de la ventana en estado "abierto", en píxeles, o `null` si no hay que
 * tocar el que dan los estilos (escritorio, o cuando el tamaño es el fijo).
 */
export function getOpenSize(deviceType, viewport, cfg = {}) {
  const baseW = Number(cfg.widgetWidth) || 360;
  const baseH = Number(cfg.widgetHeight) || 520;

  if (deviceType === 'mobile' && cfg.mobileAutoFullscreen === false) {
    // Ventana flotante en un teléfono: cabe en la pantalla con un margen.
    return {
      width: Math.max(0, Math.min(baseW, viewport.width - 24)),
      height: Math.max(0, Math.min(baseH, viewport.height - 32)),
    };
  }

  if (deviceType === 'tablet' && cfg.tabletAutoFit !== false) {
    const targetW = Number(cfg.tabletWidth) || baseW;
    const targetH = Number(cfg.tabletHeight) || baseH;
    return {
      width: Math.min(targetW, Math.round(viewport.width * 0.88)),
      height: Math.min(targetH, Math.round(viewport.height * 0.82)),
    };
  }

  return null;
}
