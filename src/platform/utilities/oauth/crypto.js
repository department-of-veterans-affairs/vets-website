const base64 = require('base-64');

// Decimal to Hexadecimal
const decimal2hex = dec => `0${dec.toString(16)}`.substr(-2);

/**
 * @description Calculate the SHA256 hash of the input
 * @param {ArrayBufferView} plain Input text
 * @returns {Promise} Returns Promise of an ArrayBuffer
 */
export async function sha256(plain) {
  // Transforms string into a Uint8Array (utf8)
  const utf8 = new TextEncoder().encode(plain);
  // Returns promise of an ArrayBuffer from Uint8Array
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', utf8);
  // Converts ArrayBuffer into a usable Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Maps array to Radix 16 and pads the beginning with a zero
  return hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');
}

/**
 * @description Convert the ArrayBuffer to string.
 * @param {*} data
 * @returns A Base64 Url encoded string
 */
export function base64UrlEncode(data) {
  if (!data || !data.length) return null;
  return base64.encode(data);
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
