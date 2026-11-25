// «Rellenar huecos» (v1.3.21) en los botones en horizontal: cada botón va al primer renglón
// donde cabe, así uno corto sube a llenar el espacio que dejó uno largo en un renglón de arriba.
// El orden visual puede cambiar; sin la opción, los botones van en su orden.
//
// El mismo algoritmo está en Treeflow, para la consola y la vista previa:
// frontend/src/features/integrations/treeflow-web/utils/rellenoDeHuecos.ts.

/** La posición final de cada botón (para `order`), dados sus anchos, el ancho disponible y el espacio entre ellos. */
export function ordenConHuecosRellenos(anchos, disponible, espacio) {
  const renglones = [];
  anchos.forEach((ancho, i) => {
    // Medio píxel de margen: los anchos medidos traen decimales.
    const renglon = renglones.find((r) => r.libre + 0.5 >= espacio + ancho);
    if (renglon) {
      renglon.libre -= espacio + ancho;
      renglon.botones.push(i);
    } else {
      renglones.push({ libre: disponible - ancho, botones: [i] });
    }
  });
  const orden = [];
  let posicion = 0;
  renglones.forEach((r) => r.botones.forEach((i) => { orden[i] = posicion++; }));
  return orden;
}

/** Acomoda los grupos `.rich-buttons.rellenar` de `raiz`, y otra vez cada vez que cambie su ancho. */
export function rellenarHuecos(raiz) {
  raiz.querySelectorAll('.rich-buttons.horizontal.rellenar').forEach((grupo) => {
    const acomodar = () => {
      const botones = Array.from(grupo.children);
      const espacio = parseFloat(getComputedStyle(grupo).columnGap) || 0;
      const orden = ordenConHuecosRellenos(botones.map((b) => b.getBoundingClientRect().width), grupo.clientWidth, espacio);
      botones.forEach((b, i) => { b.style.order = String(orden[i]); });
    };
    acomodar();
    if (typeof ResizeObserver === 'function' && !grupo.dataset.rellenoObservado) {
      grupo.dataset.rellenoObservado = '1';
      new ResizeObserver(acomodar).observe(grupo);
    }
  });
}
