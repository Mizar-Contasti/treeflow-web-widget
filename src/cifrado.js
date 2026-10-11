// "Encriptar comunicación": AES-256-GCM con WebCrypto, el mismo sobre que abre el
// backend (core/utils/cifrado_canal.py): base64(iv ‖ texto_cifrado ‖ etiqueta),
// con `tree_id|sentido` ('req' o 'resp') como dato asociado: un sobre de una
// dirección no vale en la otra.
//
// La clave llega por /widget-config, que es público: esto oculta el contenido a
// quien sólo observa el tráfico, no a quien cargue el widget.

const TAM_IV = 12;

const aad = (treeId, sentido) => new TextEncoder().encode(`${treeId}|${sentido}`);

export const hayWebCrypto = () =>
  typeof crypto !== 'undefined' && !!crypto.subtle && typeof crypto.getRandomValues === 'function';

const aBase64 = (bytes) => {
  let binario = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binario += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(binario);
};

const deBase64 = (texto) => Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));

const importarClave = (claveBase64) =>
  crypto.subtle.importKey('raw', deBase64(claveBase64), 'AES-GCM', false, ['encrypt', 'decrypt']);

export async function cifrar(claveBase64, texto, treeId, sentido) {
  const iv = crypto.getRandomValues(new Uint8Array(TAM_IV));
  const cifrado = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad(treeId, sentido) },
    await importarClave(claveBase64),
    new TextEncoder().encode(texto),
  ));
  const sobre = new Uint8Array(iv.length + cifrado.length);
  sobre.set(iv);
  sobre.set(cifrado, iv.length);
  return aBase64(sobre);
}

export async function descifrar(claveBase64, sobreBase64, treeId, sentido) {
  const sobre = deBase64(sobreBase64);
  const claro = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: sobre.subarray(0, TAM_IV), additionalData: aad(treeId, sentido) },
    await importarClave(claveBase64),
    sobre.subarray(TAM_IV),
  );
  return new TextDecoder().decode(claro);
}
