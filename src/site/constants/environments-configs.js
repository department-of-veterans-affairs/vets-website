/**
 * All possible values for the environment name, also known as the build-type.
 * @module site/constants/environments
 */
const ENVIRONMENTS = require('./environments');

let isNode = false;

if (typeof window === 'undefined') {
  isNode = true;
}

// allowedHostnames is an array of hostnames that are eligible
function isHostnameAllowed(hostname, allowedHostnames) {
  let hostnameAllowed = false;
  for (const name of allowedHostnames) {
    const pattern = name.replace(/\*/g, '[a-z0-9]+(-[a-z0-9]+)*');
    const regex = new RegExp(`^${pattern}$`, 'i');
    if (regex.test(hostname)) {
      hostnameAllowed = true;
    }
  }
  return hostnameAllowed;
}

module.exports = {
  [ENVIRONMENTS.VAGOVPROD]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVPROD,
    BASE_URL: 'https://www.va.gov',
    API_URL: 'https://api.va.gov',
  },

  [ENVIRONMENTS.VAGOVSTAGING]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVSTAGING,
    BASE_URL: 'https://staging.va.gov',
    API_URL: 'https://staging-api.va.gov',
  },

  [ENVIRONMENTS.VAGOVDEV]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVDEV,
    BASE_URL: 'https://dev.va.gov',
    API_URL: 'https://dev-api.va.gov',
  },

  /* eslint-disable no-restricted-globals */
  /* eslint-disable no-nested-ternary */

  [ENVIRONMENTS.LOCALHOST]: {
    BUILDTYPE: ENVIRONMENTS.LOCALHOST,
    BASE_URL: isNode
      ? 'https://localhost:3001'
      : `http://${location.hostname || 'localhost'}:${
          location.port ? location.port : '3001'
        }`,
    API_URL: isNode
      ? `http://${process.env.API_HOST}:3000`
      : location.hostname &&
        isHostnameAllowed(location.hostname, [
          '*.preview.va.gov',
          '*.vfs.va.gov',
        ])
        ? `http://${location.hostname.split('.')[0]}-api.${location.hostname
            .split('.')
            .slice(1)
            .join('.')}:3000`
        : `http://${location.hostname || 'localhost'}:3000`,
  },

  /* eslint-enable no-restricted-globals */
  /* eslint-enable no-nested-ternary */
};
