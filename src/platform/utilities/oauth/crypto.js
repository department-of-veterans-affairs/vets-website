// Decimal to Hexadecimal
const decimal2hex = dec => `0${dec.toString(16)}`.substr(-2);

/**
 * @description Calculate the SHA256 hash of the input
 * @param {ArrayBufferView} plain Input text
 * @returns {Promise} Returns Promise of an ArrayBuffer
 */
export function sha256(plain) {
  // Transforms string into a Uint8Array (utf8)
  if (!plain || plain.length === 0) {
    throw new Error('input must be defined');
  }

  const data = new TextEncoder().encode(plain);
  try {
    // eslint-disable-next-line import/no-unresolved
    const { webcrypto } = require('node:crypto');
    return webcrypto?.subtle?.digest('SHA-256', data);
  } catch (err) {
    if (typeof window !== 'undefined' && window?.crypto?.subtle) {
      return window?.crypto?.subtle?.digest('SHA-256', data);
    }

    throw new Error('crypto.subtle not available');
  }
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

  try {
    // eslint-disable-next-line import/no-unresolved
    const { webcrypto } = require('node:crypto');
    webcrypto.getRandomValues(arr);
  } catch (err) {
    if (typeof window !== 'undefined' && window?.crypto) {
      window?.crypto?.getRandomValues(arr);
    } else {
      throw new Error('crypto.getRandomValues not available in this env');
    }
  }

  return Array.from(arr, decimal2hex).join('');
}
