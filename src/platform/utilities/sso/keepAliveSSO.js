import { ssoKeepAliveEndpoint } from './constants';

export default function keepAlive() {
  return fetch(ssoKeepAliveEndpoint(), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
}
