import * as Sentry from '@sentry/browser';

import environment from 'platform/utilities/environment';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';
import mockKeepAlive from './mockKeepAliveSSO';
import liveKeepAlive from './keepAliveSSO';

const keepAlive = environment.isLocalhost() ? mockKeepAlive : liveKeepAlive;
let ssoSessionLength = 9000; // milliseconds

export async function ssoKeepAliveSession() {
  try {
    const res = await keepAlive();
    const hasSSOsession = res.headers.get('session-alive');
    if (hasSSOsession === 'true') {
      // 'session-timeout' is in seconds, convert to milliseconds
      ssoSessionLength = res.headers.get('session-timeout') * 1000;

      const expirationTime = new Date();
      expirationTime.setTime(expirationTime.getTime() + ssoSessionLength);
      localStorage.setItem('sessionExpirationSSO', expirationTime);
      localStorage.setItem('hasSessionSSO', true);
    } else {
      localStorage.removeItem('hasSessionSSO');
    }
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      Sentry.captureMessage(`SSOe error: ${err.message}`);
    });
  }
}
export function checkAndUpdateSSOeSession() {
  if (hasSessionSSO()) {
    const sessionExpiration = localStorage.getItem('sessionExpirationSSO');

    // We want to minimize external keepalive calls, so this functions as self-enforced rate limiting
    const percentageOfTimeoutThreshold = 0.67;
    const remainingSessionTime = Date.parse(sessionExpiration) - Date.now();
    if (
      remainingSessionTime / ssoSessionLength >
      percentageOfTimeoutThreshold
    ) {
      return;
    }

    ssoKeepAliveSession();
  }
}
