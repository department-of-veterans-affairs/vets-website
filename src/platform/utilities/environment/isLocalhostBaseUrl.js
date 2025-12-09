const LOOPBACK_HOSTS = ['localhost', '127.0.0.1'];
const LOCAL_PROTOCOLS = ['http', 'https'];

const LOCAL_BASE_URLS = new Set(
  LOOPBACK_HOSTS.flatMap(host =>
    LOCAL_PROTOCOLS.map(protocol => `${protocol}://${host}:3001`),
  ),
);

/**
 * Determines if a base URL points to the local webpack dev server.
 *
 * @param {string} baseUrl - URL to evaluate.
 * @returns {boolean} - True when url is a loopback host on port 3001.
 */
const isLocalhostBaseUrl = baseUrl => LOCAL_BASE_URLS.has(baseUrl);

export default isLocalhostBaseUrl;
