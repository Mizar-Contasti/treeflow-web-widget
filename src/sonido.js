// Sonido al llegar un mensaje (v1.3.20). Los sonidos se generan con Web Audio:
// no hay archivos que descargar ni licencias. Cada sonido es una lista de notas
// (frecuencia de inicio y, si se desliza, de llegada; cuándo empieza y cuánto
// dura, en segundos; forma de onda y volumen relativo).
//
// La misma lista está en Treeflow, para el botón «Probar» del panel y su vista
// previa: frontend/src/features/integrations/treeflow-web/utils/sonidoDeAviso.ts.
// Si se cambia aquí, se cambia allí.
export const SONIDOS = {
  burbuja: [{ onda: 'sine', desde: 420, hasta: 880, inicio: 0, duracion: 0.14 }],
  campana: [
    { onda: 'sine', desde: 1318, inicio: 0, duracion: 0.7 },
    { onda: 'sine', desde: 2637, inicio: 0, duracion: 0.45, volumen: 0.35 },
  ],
  pop: [{ onda: 'sine', desde: 900, hasta: 320, inicio: 0, duracion: 0.08 }],
  suave: [
    { onda: 'sine', desde: 660, inicio: 0, duracion: 0.16 },
    { onda: 'sine', desde: 880, inicio: 0.12, duracion: 0.24 },
  ],
  doble: [
    { onda: 'triangle', desde: 988, inicio: 0, duracion: 0.22 },
    { onda: 'triangle', desde: 784, inicio: 0.18, duracion: 0.36 },
  ],
};

/** Toca `nombre` (si no existe, «burbuja») con `volumen` entre 0 y 1. */
export function tocarSonido(ctx, nombre, volumen) {
  const notas = SONIDOS[nombre] || SONIDOS.burbuja;
  const nivel = Math.max(0, Math.min(1, Number(volumen)));
  if (!ctx || !(nivel > 0)) return;
  const ahora = ctx.currentTime + 0.01;
  const salida = ctx.createGain();
  salida.gain.value = nivel * 0.5;
  salida.connect(ctx.destination);
  notas.forEach((nota) => {
    const oscilador = ctx.createOscillator();
    const envolvente = ctx.createGain();
    const empieza = ahora + nota.inicio;
    const termina = empieza + nota.duracion;
    oscilador.type = nota.onda;
    oscilador.frequency.setValueAtTime(nota.desde, empieza);
    if (nota.hasta) oscilador.frequency.exponentialRampToValueAtTime(nota.hasta, termina);
    // Entrada y salida suaves: sin el clic de cortar una onda de golpe.
    envolvente.gain.setValueAtTime(0.0001, empieza);
    envolvente.gain.exponentialRampToValueAtTime(nota.volumen || 1, empieza + 0.01);
    envolvente.gain.exponentialRampToValueAtTime(0.0001, termina);
    oscilador.connect(envolvente);
    envolvente.connect(salida);
    oscilador.start(empieza);
    oscilador.stop(termina + 0.02);
  });
}
