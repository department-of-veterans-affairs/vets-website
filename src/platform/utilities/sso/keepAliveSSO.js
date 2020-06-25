import * as Sentry from '@sentry/browser';

import { ssoKeepAliveEndpoint } from 'platform/user/authentication/utilities';

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
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return {
      ttl: Number(resp.headers.get('session-timeout')),
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
      scope.setExtra('error', err);
      Sentry.captureMessage(`SSOe error: ${err.message}`);
    });
    return {};
  }
}
