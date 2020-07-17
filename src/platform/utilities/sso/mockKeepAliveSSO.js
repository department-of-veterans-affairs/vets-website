import 'url-search-params-polyfill';

export default function keepAlive() {
  const params = new URLSearchParams(window.location.search);
  return Promise.resolve({
    ttl: params.get('keepalive-ttl'),
    authn: params.get('keepalive-authn'),
  });
}
