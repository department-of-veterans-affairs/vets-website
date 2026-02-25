/**
 * Base64 URL encode a string (for mock JWT creation)
 * Works in both Node.js and browser environments.
 * @param {string} data - The string to encode
 * @returns {string} Base64 URL encoded string
 */
function base64UrlEncode(data) {
  if (!data) {
    return null;
  }

  let base64;

  // Check if Buffer is available (Node.js environment)
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(data, 'utf8').toString('base64');
  } else {
    // Browser environment: use btoa with UTF-8 handling
    // TextEncoder converts the string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(data);
    // Convert byte array to binary string for btoa
    const binaryString = String.fromCharCode(...utf8Bytes);
    base64 = btoa(binaryString);
  }

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode a string.
 * Works in both Node.js and browser environments.
 * @param {string} data - The base64url encoded string to decode
 * @returns {string} Decoded string
 */
function base64UrlDecode(data) {
  if (!data) return null;

  // Convert base64url to base64
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  // Check if Buffer is available (Node.js environment)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  // Browser environment: use atob with UTF-8 handling
  const binaryString = atob(base64);
  // Convert binary string to byte array
  const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
  // TextDecoder converts UTF-8 bytes back to string
  return new TextDecoder().decode(bytes);
}

/**
 * Decodes a JWT token and extracts the payload.
 * Works in both Node.js and browser environments.
 * Note: This does NOT verify the signature.
 *
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded payload, or null if invalid
 */
function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const decode = str => {
    return JSON.parse(base64UrlDecode(str));
  };

  return {
    header: decode(parts[0]),
    payload: decode(parts[1]),
    signature: parts[2],
  };
}

module.exports = {
  base64UrlEncode,
  base64UrlDecode,
  decodeJwt,
};
