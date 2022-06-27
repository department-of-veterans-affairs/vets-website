// Decimal to Hexadecimal
const decimal2hex = dec => `0${dec.toString(16)}`.substr(-2);

/**
 * @description Calculate the SHA256 hash of the input
 * @param {ArrayBufferView} plain Input text
 * @returns {Promise} Returns Promise of an ArrayBuffer
 */
export function sha256(plain) {
  // Transforms string into a Uint8Array (utf8)
  const data = new TextEncoder().encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

/**
 * @description Convert the ArrayBuffer to string.
 * @param {*} data
 * @returns A Base64 Url encoded string
 */
export function base64UrlEncode(data) {
  if (!data) return null;

  const _data =
    typeof data === 'string'
      ? data
      : String.fromCharCode.apply(null, new Uint8Array(data));

  return btoa(_data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 *
 * @param {Number} length
 * @returns A secure random string
 */
export function generateRandomString(length = 28) {
  const arr = new Uint32Array(length);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, decimal2hex).join('');
}
