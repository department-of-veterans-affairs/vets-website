import * as Sentry from '@sentry/browser';

import { ssoKeepAliveEndpoint } from 'platform/user/authentication/utilities';

const csidTypeMap = {
  DSLogon: 'dslogon',
  mhv: 'mhv',
  idme: 'custom',
};

export default async function keepAlive() {
  // Return a TTL, type and authn values from the IAM keepalive endpoint that
  // 1) indicates how long the user's current SSOe session will be alive for,
  // 2) the type of credentials the user should authenticate with,
  // 3_ and the AuthN context the user used when authenticating.
  //
  // Any positive TTL value means the user currently has a session, a TTL of 0
  // means they don't have an active session, and a TTL of undefined means there
  // was a problem calling the endpoint and we can't determine if they have a
  // session or not
  try {
    const resp = await fetch(ssoKeepAliveEndpoint(), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const authn = resp.headers.get('va_eauth_authncontextclassref') || '';
    return {
      ttl: Number(resp.headers.get('session-timeout')),
      type: csidTypeMap[resp.headers.get('va_eauth_csid')],
      authn: authn.trim() !== 'NOT_FOUND' ? authn : null,
    };
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      Sentry.captureMessage(`SSOe error: ${err.message}`);
    });
    return {};
  }
}
