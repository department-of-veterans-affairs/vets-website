import * as Sentry from '@sentry/browser';

import { ssoKeepAliveEndpoint } from 'platform/user/authentication/utilities';

export default async function keepAlive() {
  // Return a TTL value from the IAM keepalive endpoint that indicates how
  // long the user's current SSOe session will be alive for.  Any positive
  // value means the user currently has a session, a TTL of 0 means they
  // don't have an active session, and a TTL of null means there was a problem
  // calling the endpoint and we can't determine if they have a session or not
  try {
    const resp = await fetch(ssoKeepAliveEndpoint(), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return resp.headers.get('session-timeout');
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      Sentry.captureMessage(`SSOe error: ${err.message}`);
    });
    return null;
  }
}
