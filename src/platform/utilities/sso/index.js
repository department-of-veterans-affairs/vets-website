import moment from 'moment';
import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import { login, logout } from 'platform/user/authentication/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import { keepAlive as liveKeepAlive } from './keepAliveSSO';
import { getLoginAttempted } from './loginAttempted';

const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes, in milliseconds

function keepAlive() {
  return environment.isLocalhost() ? mockKeepAlive() : liveKeepAlive();
}

async function vaGovProfile() {
  try {
    const resp = await fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      credentials: 'include',
    });
    if (resp.ok) {
      const json = await resp.json();
      return camelCaseKeysRecursive(json.data.attributes.profile);
    }
  } catch (err) {
    // just in case of a network error, silently ignore
  }
  return null;
}

export async function ssoKeepAliveSession() {
  const { ttl, authn } = await keepAlive();
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
  return { ttl, authn };
}

export async function checkAutoSession() {
  const [{ ttl, authn }, userProfile] = await Promise.all([
    ssoKeepAliveSession(),
    vaGovProfile(),
  ]);
  if (userProfile?.signIn?.ssoe && ttl === 0) {
    // having a user session is not enough, we also need to make sure when
    // the user authenticated they used SSOe, otherwise we can't auto logout
    // explicitly check to see if the TTL for the SSO3 session is 0, as it
    // could also be null if we failed to get a response from the SSOe server,
    // in which case we don't want to logout the user because we don't know
    logout('v1', 'sso-automatic-logout');
  } else if (!userProfile && ttl > 0 && !getLoginAttempted() && authn) {
    // only attempt an auto login if the user is
    // a) does not have a VA.gov session
    // b) has an SSOe session
    // c) has not previously tried to login (if the last attempt to login failed
    //    don't keep retrying)
    // d) we have a non empty type value from the keepalive call to login with
    login('custom', 'v1', { authn }, 'sso-automatic-login');
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
