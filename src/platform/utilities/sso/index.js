import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import liveKeepAlive from './keepAliveSSO';

const keepAlive = environment.isLocalhost() ? mockKeepAlive : liveKeepAlive;
const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes

export async function ssoKeepAliveSession() {
  const ttl = await keepAlive();
  if (ttl > 0) {
    // ttl is positive, user has an active session
    const expirationTime = new Date();
    // 'ttl' is in seconds, convert to milliseconds
    expirationTime.setTime(expirationTime.getTime() + ttl * 1000);
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
export function checkAndUpdateSSOeSession() {
  if (hasSessionSSO() === 'true') {
    const sessionExpiration = localStorage.getItem('sessionExpirationSSO');

    const remainingSessionTime = Date.parse(sessionExpiration) - Date.now();
    if (remainingSessionTime <= keepAliveThreshold) {
      ssoKeepAliveSession();
    }
  }
}
