// import { hasSession, hasSessionSSO } from 'platform/user/profile/utilities';

/**
 * we're gonna need to implement some kind of mechanism
 * that avoids the auto-login/auto-logout stuff locally
 */

export default function keepAlive() {
  const headers = new Headers();

  headers.set('session-alive', 'true');
  headers.set('session-timeout', 900);
  headers.set(
    'Access-Control-Expose-Headers',
    'session-alive, session-timeout',
  );

  const response = new Response(new Blob(), {
    status: 200,
    statusText: 'OK',
    headers,
  });

  return Promise.resolve(response);
}
