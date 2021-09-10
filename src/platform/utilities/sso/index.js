import moment from 'moment';
import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';
import { loginAppUrlRE } from 'applications/login/utilities/paths';

import {
  standaloneRedirect,
  login,
  logout,
} from 'platform/user/authentication/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import { keepAlive as liveKeepAlive } from './keepAliveSSO';
import { getLoginAttempted } from './loginAttempted';

const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes, in milliseconds

function keepAlive() {
  return environment.isLocalhost() ? mockKeepAlive() : liveKeepAlive();
}

export async function ssoKeepAliveSession() {
  const { ttl, transactionid, authn } = await keepAlive();
  if (ttl > 0) {
    // ttl is positive, user has an active session
    // ttl is in seconds, add from now
    const expirationTime = moment().add(ttl, 's');
    localStorage.setItem('sessionExpirationSSO', expirationTime);
    localStorage.setItem('hasSessionSSO', true);
  } else if (ttl === 0) {
    // ttl is 0, user has an inactive session
    localStorage.setItem('hasSessionSSO', false);
  } else {
    // ttl is null, we can't determine if the user has a session or not
    localStorage.removeItem('hasSessionSSO');
  }
  return { ttl, transactionid, authn };
}

export async function checkAutoSession(
  loggedIn,
  ssoeTransactionId,
  profile = {},
) {
  const { ttl, transactionid, authn } = await ssoKeepAliveSession();

  if (loggedIn && ssoeTransactionId) {
    // being logged in is not enough, we also need to make sure that the user
    // has been authenticated with SSOe, otherwise we don't want to perform any
    // auto login/logout operations.
    if (ttl === 0) {
      // explicitly check to see if the TTL for the SSOe session is 0, as it
      // could also be undefined if we failed to get a response from the SSOe server,
      // in which case we don't want to logout the user, because we don't know
      // their SSOe status.
      logout('sso-automatic-logout', { 'auto-logout': 'true' });
    } else if (transactionid && transactionid !== ssoeTransactionId) {
      // compare the transaction id from the keepalive endpoint with the existing
      // transaction id. If they don't match, it means we might have a different
      // user logged in. Thus, we should perform an auto login, which will
      // effectively logout the user then log them back in.
      login('custom', { authn }, 'sso-automatic-login');
    } else if (
      loginAppUrlRE.test(window.location.pathname) &&
      ttl > 0 &&
      profile.verified
    ) {
      // the user is in the login app, but already logged in with SSOe
      // and verified, redirect them back to their return url
      window.location = standaloneRedirect() || window.location.origin;
    }
  } else if (!loggedIn && ttl > 0 && !getLoginAttempted() && authn) {
    // only attempt an auto login if the user is
    // a) does not have a VA.gov session
    // b) has an SSOe session
    // c) has not previously tried to login (if the last attempt to login failed
    //    don't keep retrying)
    // d) we have a non empty type value from the keepalive call to login with
    login('custom', { authn }, 'sso-automatic-login');
  }
}

export function checkAndUpdateSSOeSession() {
  if (hasSessionSSO()) {
    const sessionExpiration = localStorage.getItem('sessionExpirationSSO');

    const remainingSessionTime = moment(sessionExpiration).diff(moment());
    if (remainingSessionTime <= keepAliveThreshold) {
      ssoKeepAliveSession();
    }
  }
}
