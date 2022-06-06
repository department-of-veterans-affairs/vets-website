const base64 = require('base-64');

const toUtf8 = data => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};

/**
 * @description Calculate the SHA256 hash of the input
 * @param {ArrayBufferView} plain Input text
 * @returns {Promise} Returns Promise of an ArrayBuffer
 */
export function sha256(plain) {
  const data = toUtf8(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

/**
 * @description Convert the ArrayBuffer to string using Uint8 array.
 * @param {*} string
 * @returns A Base64 Url encoded string
 */
export function base64UrlEncode(string) {
  if (!string || !string.length) return null;
  const data = toUtf8(string);
  return base64.encode(data);
}

// Decimal to Hexadecimal
const decimal2hex = dec => `0${dec.toString(16)}`.substr(-2);

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
