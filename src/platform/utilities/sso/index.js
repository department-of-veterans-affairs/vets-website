import moment from 'moment';
import { pickBy } from 'lodash';
import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSession, hasSessionSSO } from '../../user/profile/utilities';
import { login, logout } from 'platform/user/authentication/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import liveKeepAlive from './keepAliveSSO';
import { getForceAuth } from './forceAuth';

const keepAlive = environment.isLocalhost() ? mockKeepAlive : liveKeepAlive;
const keepAliveThreshold = 5 * 60 * 1000; // 5 minutes, in milliseconds

export async function ssoKeepAliveSession() {
  const { ttl, type, authn } = await keepAlive();
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
  return { type, authn };
}

export async function checkAutoSession(application = null, to = null) {
  const { type, authn } = await ssoKeepAliveSession();
  if (hasSession() && hasSessionSSO() === false) {
    // explicitly check to see if the SSOe session is false, as it could also
    // be null if we failed to get a response from the SSOe server, in which
    // case we don't want to logout the user because we don't know
    logout('v1', 'sso-automatic-logout');
  } else if (!hasSession() && hasSessionSSO() && !getForceAuth() && type) {
    // only attempt an auto login if the user is
    // a) does not have a VA.gov session
    // b) has an SSOe session
    // c) is not required for forceAuth (meaning their environment has SSOe
    //    enabled and they have not previously tried to login)
    // d) we have a non empty type value from the keepalive call to login with
    const params = pickBy({ inbound: 'true', authn });
    login(type, 'v1', application, to, params, 'sso-automatic-login');
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
