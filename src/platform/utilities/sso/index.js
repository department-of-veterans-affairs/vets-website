import moment from 'moment';
import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';
import { login, logout } from 'platform/user/authentication/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import { keepAlive as liveKeepAlive } from './keepAliveSSO';
import { getLoginAttempted } from './loginAttempted';

const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes, in milliseconds

function keepAlive() {
  return environment.isLocalhost() ? mockKeepAlive() : liveKeepAlive();
}

async function hasVAGovSession() {
  try {
    const resp = await fetch(`${environment.API_URL}/v0/user`, {
      method: 'HEAD',
      credentials: 'include',
    });
    return resp.ok;
  } catch (err) {
    return false;
  }
}

export async function ssoKeepAliveSession() {
  const { ttl, authn, sessionAlive } = await keepAlive();
  if (!sessionAlive) {
    localStorage.setItem('hasSessionSSO', false);
  } else if (sessionAlive && ttl > 0) {
    // ttl is in seconds, add from now
    const expirationTime = moment().add(ttl, 's');
    localStorage.setItem('sessionExpirationSSO', expirationTime);
    localStorage.setItem('hasSessionSSO', true);
  } else {
    // ttl is null or 0, we can't determine if the user has a session or not
    localStorage.removeItem('hasSessionSSO');
  }
  return { ttl, authn };
}

export async function checkAutoSession(
  authenticatedWithSSOe,
  application = null,
  to = null,
) {
  const [
    { ttl, authn, sessionAlive: sessionAliveSSO },
    hasSession,
  ] = await Promise.all([ssoKeepAliveSession(), hasVAGovSession()]);
  if (hasSession && authenticatedWithSSOe && !sessionAliveSSO) {
    // explicitly check to see if the TTL for the SSO3 session is 0, as it
    // could also be null if we failed to get a response from the SSOe server,
    // in which case we don't want to logout the user because we don't know
    logout('v1', 'sso-automatic-logout');
  } else if (!hasSession && !sessionAliveSSO && !getLoginAttempted() && authn) {
    // only attempt an auto login if the user is
    // a) does not have a VA.gov session
    // b) has an SSOe session
    // c) has not previously tried to login (if the last attempt to login failed
    //    don't keep retrying)
    // d) we have a non empty type value from the keepalive call to login with
    login('custom', 'v1', application, to, { authn }, 'sso-automatic-login');
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
