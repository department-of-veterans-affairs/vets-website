// Decimal to Hexadecimal
const decimal2hex = dec => `0${dec.toString(16)}`.substr(-2);

/**
 * @description Calculate the SHA256 hash of the input
 * @param {ArrayBufferView} plain Input text
 * @returns {Promise} Returns Promise of an ArrayBuffer
 */
export function sha256(plain) {
  if (!plain || plain.length === 0) {
    throw new Error('Parameter must not be blank');
  }

  // Transforms string into a Uint8Array (utf8)
  const data = new TextEncoder().encode(plain);

  // Check if we're in a Node environment
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    // Node v22
    try {
      // eslint-disable-next-line import/no-unresolved
      const crypto = require('crypto');
      if (crypto?.webcrypto && crypto?.webcrypto?.subtle) {
        return crypto?.webcrypto?.subtle?.digest('SHA-256', data);
      }
    } catch (err) {
      // Node doesn't have webcrypto, continue to browser fallback
    }
  }

  // Browser/Node v14 fallback
  if (typeof window !== 'undefined' && window?.crypto?.subtle) {
    return window?.crypto?.subtle?.digest('SHA-256', data);
  }

  // Neither works
  throw new Error('crypto.subtle not available');
}

/**
 * @description Convert the ArrayBuffer to string.
 * @param {*} data
 * @returns A Base64 Url encoded string
 */
export function base64UrlEncode(data) {
  if (!data) return null;

  // Handle both ArrayBuffer and string inputs for compatatibility
  let base64;

  if (data instanceof ArrayBuffer) {
    if (typeof Buffer !== 'undefined') {
      // Convert ArrayBuffer to base64
      base64 = Buffer.from(data).toString('base64');
    } else {
      // Browser env
      const bytes = new Uint8Array(data);
      const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join(
        '',
      );
      base64 = btoa(binary);
    }
  } else {
    // Legacy string input support
    base64 =
      typeof Buffer !== 'undefined'
        ? Buffer.from(data, 'utf8').toString('base64') // Node.js
        : btoa(data); // Browser
  }

  return base64
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

  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    // Node 22
    try {
      // eslint-disable-next-line import/no-unresolved
      const crypto = require('crypto');
      if (crypto?.webcrypto && crypto?.webcrypto?.getRandomValues) {
        crypto?.webcrypto.getRandomValues(arr);
        return Array.from(arr, decimal2hex).join('');
      }
    } catch (err) {
      // Continue to browser fallback
    }
  }

  // Node 14/Browser fallback
  if (typeof window !== 'undefined' && window?.crypto) {
    window?.crypto?.getRandomValues(arr);
  } else {
    throw new Error('crypto.getRandomValues not available in this env');
  }

  return Array.from(arr, decimal2hex).join('');
}
