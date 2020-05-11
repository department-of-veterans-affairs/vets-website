import moment from 'moment';
import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import liveKeepAlive from './keepAliveSSO';

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
export function checkAndUpdateSSOeSession() {
  if (hasSessionSSO()) {
    const sessionExpiration = localStorage.getItem('sessionExpirationSSO');

    const remainingSessionTime = moment(sessionExpiration).diff(moment());
    if (remainingSessionTime <= keepAliveThreshold) {
      ssoKeepAliveSession();
    }
  }
}
