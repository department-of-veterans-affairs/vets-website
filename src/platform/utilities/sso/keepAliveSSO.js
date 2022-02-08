import * as Sentry from '@sentry/browser';
import {
  SSO_KEEP_ALIVE_ENDPOINT,
  CSP_AUTHN,
  AUTHN_HEADERS,
  CAUGHT_EXCEPTIONS,
  SKIP_DUPE_QUERY,
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

export const sanitizeAuthn = (authnCtx = 'NOT_FOUND') => {
  const emptyString = '';
  return authnCtx === null || !authnCtx.length
    ? 'NOT_FOUND'
    : authnCtx
        .replace(SKIP_DUPE_QUERY.SINGLE_QUERY, emptyString)
        .replace(SKIP_DUPE_QUERY.MULTIPLE_QUERIES, emptyString);
};

export const defaultKeepAliveResponse = {
  ttl: 0,
  transactionid: null,
  authn: undefined,
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

    const alive = resp.headers.get(AUTHN_HEADERS.ALIVE);

    // If no CSP or session-alive headers, return early
    if (resp.headers.get(AUTHN_HEADERS.CSP) === null || alive !== 'true') {
      return defaultKeepAliveResponse;
    }

    await resp.text();
    /**
     * Uses mapped authncontext for DS Logon and MHV
     * Uses `authncontextclassref` lookup for ID.me and Login.gov
     */
    const authn = {
      DSLogon: CSP_AUTHN.DS_LOGON,
      mhv: CSP_AUTHN.MHV,
      LOGINGOV: resp.headers.get(AUTHN_HEADERS.AUTHN_CONTEXT),
      idme: resp.headers.get(AUTHN_HEADERS.AUTHN_CONTEXT),
    }[resp.headers.get(AUTHN_HEADERS.CSP)];

    return {
      ttl:
        alive === 'true' ? Number(resp.headers.get(AUTHN_HEADERS.TIMEOUT)) : 0,
      transactionid: resp.headers.get(AUTHN_HEADERS.TRANSACTION_ID),
      authn: sanitizeAuthn(authn),
    };
  } catch (err) {
    logToSentry(err);
    return {};
  }
}

export { keepAlive };
