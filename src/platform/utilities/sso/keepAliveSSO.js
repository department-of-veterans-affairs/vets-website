import * as Sentry from '@sentry/browser';
import {
  SSO_KEEP_ALIVE_ENDPOINT,
  CSP_AUTHN,
  AUTHN_HEADERS,
  CAUGHT_EXCEPTIONS,
} from './constants';

const SENTRY_LOG_THRESHOLD = [Sentry.Severity.Info];

const logToSentry = data => {
  let isCaptured = null;
  const { message } = data;

  const LEVEL = CAUGHT_EXCEPTIONS[message]
    ? CAUGHT_EXCEPTIONS[message].LEVEL
    : CAUGHT_EXCEPTIONS.default.LEVEL;

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
  /* Return a TTL and authn values from the IAM keepalive endpoint that
  * 1) indicates how long the user's current SSOe session will be alive for,
  * 2) and the AuthN context the user used when authenticating.

  * Any positive TTL value means the user currently has a session, a TTL of 0
  * means they don't have an active session, and a TTL of undefined means there
  * was a problem calling the endpoint and we can't determine if they have a
  * session or not
  */
  try {
    const resp = await fetch(SSO_KEEP_ALIVE_ENDPOINT, {
      method: 'HEAD',
      credentials: 'include',
      cache: 'no-store',
    });

    await resp.text();
    const alive = resp.headers.get(AUTHN_HEADERS.ALIVE);

    return {
      ttl:
        alive === 'true' ? Number(resp.headers.get(AUTHN_HEADERS.TIMEOUT)) : 0,
      transactionid: resp.headers.get(AUTHN_HEADERS.TRANSACTION_ID),
      /* for DSLogon or mhv, use a mapped authn context value, however for
      * idme, we need to use the provided authncontextclassref as it could be
      * for LOA1 or LOA3.  Any other csid values should be ignored, and we
      * should return undefined
      */
      authn: {
        DSLogon: CSP_AUTHN.DS_LOGON,
        mhv: CSP_AUTHN.MHV,
        idme: resp.headers.get(AUTHN_HEADERS.ID_ME),
      }[resp.headers.get(AUTHN_HEADERS.CSP)],
    };
  } catch (err) {
    logToSentry(err);
    return {};
  }
}

export { keepAlive };
