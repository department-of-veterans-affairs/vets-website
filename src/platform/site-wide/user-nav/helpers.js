import { fromPairs } from 'lodash';

import { hasSession, hasSessionSSO } from 'platform/user/profile/utilities';
import { ssoKeepAliveSession, getForceAuth } from 'platform/utilities/sso';
import { autoLogin, autoLogout } from 'platform/user/authentication/utilities';

function parseqs(value) {
  /*
   * naive query string parsing function, takes a query string and returns
   * an object mapping the keys to values.
   */
  const data = value.startsWith('?') ? value.substring(1) : value;
  const entries = data ? data.split('&').map(q => q.split('=')) : [];
  return fromPairs(entries);
}

async function checkAutoSession(callback) {
  await ssoKeepAliveSession();
  if (hasSession() && hasSessionSSO() === false) {
    // explicitly check to see if the SSOe session is false, as it could also
    // be null if we failed to get a response from the SSOe server, in which
    // case we don't want to logout the user because we don't know
    autoLogout();
  } else if (!hasSession() && hasSessionSSO() && !getForceAuth()) {
    autoLogin();
  }

  if (callback) {
    callback();
  }
}

export { parseqs, checkAutoSession };
