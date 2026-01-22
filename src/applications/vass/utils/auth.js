import Cookies from 'js-cookie';
import { VASS_TOKEN_COOKIE_NAME } from './constants';

/**
 * Base64 URL decode a string (browser-compatible)
 * @param {string} data - The base64url encoded string to decode
 * @returns {string} Decoded string
 */
const base64UrlDecode = data => {
  if (!data) return null;

  // Convert base64url to base64
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  return atob(base64);
};

/**
 * Decodes a JWT token and extracts the payload.
 * Note: This does NOT verify the signature.
 *
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded payload, or null if invalid
 */
export const decodeJwt = token => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
};

/**
 * Checks if a JWT token is expired.
 *
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if the token is expired or invalid, false otherwise
 */
export const isTokenExpired = token => {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
};

export const getVassToken = () => Cookies.get(VASS_TOKEN_COOKIE_NAME);

/**
 * Gets the VASS token if it exists and is not expired.
 * @returns {string|null} The token if valid, null if missing or expired
 */
export const getValidVassToken = () => {
  const token = getVassToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }
  return token;
};

/**
 * Removes the VASS token cookie.
 */
export const removeVassToken = () => {
  Cookies.remove(VASS_TOKEN_COOKIE_NAME);
};
