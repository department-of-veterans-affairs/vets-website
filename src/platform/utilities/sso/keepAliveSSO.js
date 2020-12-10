/* eslint-disable no-console */
import * as Sentry from '@sentry/browser';

import { ssoKeepAliveEndpoint } from 'platform/user/authentication/utilities';

export default async function keepAlive() {
  // Having outside of keepAlive method could expose information
  const caughtExceptions = {
    // Possible CORS issue
    'Failed to fetch': {
      LEVEL: Sentry.Severity.Error,
    },
    'NetworkError when attempting to fetch resource.': {
      LEVEL: Sentry.Severity.Error,
    },
    'The Internet connection appears to be offline': {
      LEVEL: Sentry.Severity.Info,
    },
    'The network connection was lost.': {
      LEVEL: Sentry.Severity.Info,
    },
    cancelled: {
      LEVEL: Sentry.Severity.Info,
    },
    default: {
      LEVEL: Sentry.Severity.Error,
    },
  };
  // Return a TTL and authn values from the IAM keepalive endpoint that
  // 1) indicates how long the user's current SSOe session will be alive for,
  // 2) and the AuthN context the user used when authenticating.
  //
  // Any positive TTL value means the user currently has a session, a TTL of 0
  // means they don't have an active session, and a TTL of undefined means there
  // was a problem calling the endpoint and we can't determine if they have a
  // session or not
  try {
    const resp = await fetch(ssoKeepAliveEndpoint(), {
      method: 'HEAD',
      credentials: 'include',
      cache: 'no-store',
    });

    const alive = resp.headers.get('session-alive');

    return {
      ttl: alive === 'true' ? Number(resp.headers.get('session-timeout')) : 0,
      transactionid: resp.headers.get('va_eauth_transactionid'),
      // for DSLogon or mhv, use a mapped authn context value, however for
      // idme, we need to use the provided authncontextclassref as it could be
      // for LOA1 or LOA3.  Any other csid values should be ignored, and we
      // should return undefined
      authn: {
        DSLogon: 'dslogon',
        mhv: 'myhealthevet',
        idme: resp.headers.get('va_eauth_authncontextclassref'),
      }[resp.headers.get('va_eauth_csid')],
    };
  } catch (err) {
    Sentry.withScope(scope => {
      const LEVEL = caughtExceptions[err.message]
        ? caughtExceptions[err.message].TYPE
        : caughtExceptions.default.TYPE;

      scope.setLevel(LEVEL);
      scope.setExtra('extraData', err);
      Sentry.captureException(`SSOe ${LEVEL}: ${err.message}`);
    });
    return {};
  }
}

export { keepAlive };
