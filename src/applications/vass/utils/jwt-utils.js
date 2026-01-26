/**
 * Base64 URL encode a string (for mock JWT creation)
 * @param {string} data - The string to encode
 * @returns {string} Base64 URL encoded string
 */
function base64UrlEncode(data) {
  if (!data) {
    return null;
  }

  const base64 = Buffer.from(data, 'utf8').toString('base64');

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode a string (browser-compatible)
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

  // TODO: use Buffer.from(base64, 'base64').toString('utf-8') instead of atob
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Decodes a JWT token and extracts the payload.
 * Note: This does NOT verify the signature.
 *
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded payload, or null if invalid
 */
function decodeJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const decode = str => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
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
