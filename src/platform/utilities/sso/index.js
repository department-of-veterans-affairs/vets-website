import moment from 'moment';
import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSession, hasSessionSSO } from '../../user/profile/utilities';
import { autoLogin, autoLogout } from 'platform/user/authentication/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import liveKeepAlive from './keepAliveSSO';
import { getForceAuth } from './forceAuth';

const keepAlive = environment.isLocalhost() ? mockKeepAlive : liveKeepAlive;
const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes, in milliseconds

export async function ssoKeepAliveSession() {
  const ttl = await keepAlive();
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
}

export async function checkAutoSession() {
  await ssoKeepAliveSession();
  if (hasSession() && hasSessionSSO() === false) {
    // explicitly check to see if the SSOe session is false, as it could also
    // be null if we failed to get a response from the SSOe server, in which
    // case we don't want to logout the user because we don't know
    autoLogout();
  } else if (!hasSession() && hasSessionSSO() && !getForceAuth()) {
    autoLogin();
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
