/**
 * All possible values for the environment name, also known as the build-type.
 * @module site/constants/environments
 */
const ENVIRONMENTS = require('./environments');

const localHostname = encodeURIComponent(location.hostname);
let isNode = false;

if (typeof window === 'undefined') {
  isNode = true;
}

function isHostnameAllowed(hostname) {
  // Escape special characters in the hostname
  const allowList = '*.preview.va.gov';

  const escapedHostname = hostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression pattern from the allow list
  const pattern = allowList.replace(/\*/g, '[a-z0-9]+(-[a-z0-9]+)*');

  // Create a regular expression object with the pattern and 'i' flag for case-insensitive matching
  const regex = new RegExp(`^${pattern}$`, 'i');

  // Check if the hostname matches the allow list pattern
  return regex.test(escapedHostname);
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
      : localHostname && isHostnameAllowed(localHostname)
        ? `http://${location.hostname.split('.')[0]}-api.${location.hostname
            .split('.')
            .slice(1)
            .join('.')}:3000`
        : `http://${location.hostname || 'localhost'}:3000`,
  },

  /* eslint-enable no-nested-ternary */
};
