import { ssoKeepAliveEndpoint } from 'platform/user/authentication/utilities';

export default function keepAlive() {
  return fetch(ssoKeepAliveEndpoint(), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
