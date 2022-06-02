/**
 * @description Calculate the SHA256 hash of the input text
 * @param {String} plain Input text
 * @returns {Promise} Returns Promise of an ArrayBuffer
 */
export function sha256(plain) {
  if (!plain || !plain.length || !window?.crypto?.subtle) {
    return null;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

/**
 * @description Convert the ArrayBuffer to string using Uint8 array.
 * @param {*} string
 * @returns A Base64 Url encoded string
 */
export function base64UrlEncode(string) {
  if (!string || !string.length) return null;
  /**
   * btoa takes characters from 0-255 and base64 encodes it.
   * Then convert the base64 encoded to base64url encoded.
   * (replaces `+` with `-`, `/` with `_`, trim trailing)
   */
  return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Decimal to Hexadecimal
const decimal2hex = dec => {
  return `0${dec.toString(16)}`.substr(-2);
};

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
