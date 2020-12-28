import * as Sentry from '@sentry/browser';

import { ssoKeepAliveEndpoint } from 'platform/user/authentication/utilities';

const SENTRY_LOG_THRESHOLD = [Sentry.Severity.Info];

const logToSentry = data => {
  let isCaptured = null;
  const { message } = data;
  const caughtExceptions = {
    'Failed to fetch': {
      LEVEL: Sentry.Severity.Warning,
    },
    'NetworkError when attempting to fetch resource.': {
      LEVEL: Sentry.Severity.Warning,
    },
    'The Internet connection appears to be offline.': {
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

  const LEVEL = caughtExceptions[message]
    ? caughtExceptions[message].TYPE
    : caughtExceptions.default.TYPE;

  if (!SENTRY_LOG_THRESHOLD.includes(LEVEL)) {
    Sentry.withScope(scope => {
      scope.setLevel(LEVEL);
      scope.setExtra(`${LEVEL}`, data);
      if (typeof data === 'string') {
        Sentry.captureMessage(`SSOe ${LEVEL}: ${message}`);
      } else {
        Sentry.captureException(data);
      }
      isCaptured = true;
    });
  } else {
    isCaptured = false;
  }
  return isCaptured;
};

export default async function keepAlive() {
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
    logToSentry(err);
    return {};
  }
}

export { keepAlive };
