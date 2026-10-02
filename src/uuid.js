/**
 * Generates an RFC4122 version 4 UUID using standard crypto APIs with resilient fallback.
 *
 * @returns {string} Formatted UUID v4 string.
 */
export function uuidv4() {
  const c = typeof crypto !== 'undefined'
    ? crypto
    : (typeof globalThis !== 'undefined' ? globalThis.crypto : null);

  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }

  if (c && typeof c.getRandomValues === 'function') {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, ch =>
      (+ch ^ (c.getRandomValues(new Uint8Array(1))[0] & (15 >> (+ch / 4)))).toString(16)
    );
  }

  // RFC4122 v4 fallback for environments without Web Crypto API
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
