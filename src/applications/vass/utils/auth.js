import Cookies from 'js-cookie';
import { VASS_TOKEN_COOKIE_NAME, VASS_COOKIE_OPTIONS } from './constants';
import { decodeJwt } from './jwt-utils';

/**
 * Checks if a JWT token is expired.
 *
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if the token is expired or invalid, false otherwise
 */
export const isTokenExpired = token => {
  const { payload } = decodeJwt(token);
  if (!payload || !payload.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
};

/**
 * Gets the VASS token from the cookie.
 * @returns {string|null} The token if exists, null if missing
 */
export const getVassToken = () => Cookies.get(VASS_TOKEN_COOKIE_NAME);

export const setVassToken = token => {
  if (!token) return;
  const { payload } = decodeJwt(token);
  if (!payload || !payload.exp) return;

  // Convert the expiration time from seconds to milliseconds and create a Date object
  const expires = new Date(payload.exp * 1000);

  Cookies.set(VASS_TOKEN_COOKIE_NAME, token, {
    ...VASS_COOKIE_OPTIONS,
    expires,
  });
};

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
  Cookies.remove(VASS_TOKEN_COOKIE_NAME, {
    // Must include the same options as the setVassToken to ensure the cookie is removed
    ...VASS_COOKIE_OPTIONS,
  });
};
