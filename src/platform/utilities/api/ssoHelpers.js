import * as Sentry from '@sentry/browser';

import ENVIRONMENTS from '../../../site/constants/environments';
import localStorage from '../storage/localStorage';
import { hasSessionSSO } from '../../user/profile/utilities';

let ssoSessionLength = 9000; // milliseconds
const ssoKeepAliveEndpoint = () => {
  const environmentPrefixes = {
    [ENVIRONMENTS.VAGOVSTAGING]: 'sqa.',
    [ENVIRONMENTS.VAGOVDEV]: 'int.',
  };

  const envPrefix = environmentPrefixes[ENVIRONMENTS.BUILDTYPE] || '';

  return `https://${envPrefix}eauth.va.gov/keepalive`;
};

export function ssoKeepAliveSession() {
  fetch(ssoKeepAliveEndpoint(), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  })
    .then(res => {
      const hasSSOsession = res.headers.get('session-alive');

      if (hasSSOsession === 'true') {
        // 'session-timeout' is in seconds, convert to milliseconds
        ssoSessionLength = res.headers.get('session-timeout') * 1000;

        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + ssoSessionLength);
        localStorage.setItem('sessionExpirationSSO', expirationTime);
        localStorage.setItem('hasSessionSSO', true);
      } else {
        localStorage.setItem('hasSessionSSO', false);
      }
    })
    .catch(err => {
      Sentry.withScope(scope => {
        scope.setExtra('error', err);
        Sentry.captureMessage(`SSOe error: ${err.message}`);
      });
    });
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
