import addSeconds from 'date-fns/addSeconds';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import environment from 'platform/utilities/environment';
import {
  AUTH_EVENTS,
  API_VERSION,
  POLICY_TYPES,
} from 'platform/user/authentication/constants';
import {
  login,
  loginAppUrlRE,
  logout,
  createExternalApplicationUrl,
} from 'platform/user/authentication/utilities';

import { hasSessionSSO } from 'platform/user/profile/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import { keepAlive as liveKeepAlive } from './keepAliveSSO';
import { getLoginAttempted } from './loginAttempted';
import localStorage from '../storage/localStorage';

const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes, in milliseconds

function keepAlive() {
  return environment.isLocalhost() || window.Cypress
    ? mockKeepAlive()
    : liveKeepAlive();
}

export async function ssoKeepAliveSession() {
  const keepAliveResponse = await keepAlive();
  const { ttl } = keepAliveResponse;
  if (ttl > 0) {
    // ttl is positive, user has an active session
    // ttl is in seconds, add from now
    const expirationTime = addSeconds(new Date(), ttl);
    localStorage.setItem('sessionExpirationSSO', expirationTime);
    localStorage.setItem('hasSessionSSO', true);
  } else if (ttl === 0) {
    // ttl is 0, user has an inactive session
    localStorage.setItem('hasSessionSSO', false);
  } else {
    // ttl is null, we can't determine if the user has a session or not
    localStorage.removeItem('hasSessionSSO');
  }
  return keepAliveResponse;
}

/**
 *
 * @param {*} loggedIn checks if user is loggedIn
 * @param {*} ssoeTransactionId transactionId received from eAuth
 * @param {*} profile profile of current user (for verified)
 */
export async function checkAutoSession(
  loggedIn,
  ssoeTransactionId,
  profile = {},
) {
  const { ttl, transactionid, ...queryParams } = await ssoKeepAliveSession();

  /**
   * Ensure user is authenticated with SSOe by verifying
   * loggedIn status and transaction ID
   */
  if (loggedIn && ssoeTransactionId) {
    if (ttl === 0) {
      /**
       * Check if TTL is 0
       * TTL: 0 = Session invalid
       * TTL: > 0 and < 900 = Session valid
       * TTL: undefined, can't verify SSOe status
       */
      logout(API_VERSION, AUTH_EVENTS.SSO_LOGOUT, {
        'auto-logout': 'true',
      });
    } else if (transactionid && transactionid !== ssoeTransactionId) {
      /**
       * Compare transaction ID with ssoeTransactionID
       * transactionID (eAuth) !== ssoeTransaction: Different user logged in
       * and perform an auto-login with the new session. (Auto logout and re-logins)
       */
      login({
        policy: POLICY_TYPES.CUSTOM,
        queryParams: { ...queryParams },
        clickedEvent: AUTH_EVENTS.SSO_LOGIN,
      });
    } else if (
      loginAppUrlRE.test(window.location.pathname) &&
      ttl > 0 &&
      profile.verified
    ) {
      /**
       * Unified Sign-in page
       * If user has an SSOe session & is verified, redirect them
       * to the specified return url
       */
      window.location = encodeURI(
        createExternalApplicationUrl() || window.location.origin,
      );
    }
  } else if (
    !loggedIn &&
    ttl > 0 &&
    !getLoginAttempted() &&
    queryParams.csp_type
  ) {
    /**
     * Create an auto-login when the following are true
     * 1. No active VA.gov session
     * 2. Active SSOe session
     * 3. No previously attempted to login (sessionStorage `setLoginAttempted` is false)
     * 4. Have a non-empty type value from eAuth keepalive endpoint
     */
    login({
      policy: POLICY_TYPES.CUSTOM,
      queryParams: { ...queryParams },
      clickedEvent: AUTH_EVENTS.SSO_LOGIN,
    });
  }
}

export function checkAndUpdateSSOeSession() {
  if (hasSessionSSO()) {
    const sessionExpiration = localStorage.getItem('sessionExpirationSSO');

    const remainingSessionTime = differenceInSeconds(
      new Date(sessionExpiration),
      new Date(),
    );
    if (remainingSessionTime <= keepAliveThreshold) {
      ssoKeepAliveSession();
    }
  }
}
