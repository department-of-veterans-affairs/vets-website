/**
 * All possible values for the environment name, also known as the build-type.
 * @module site/constants/environments
 */
const ENVIRONMENTS = require('./environments');

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

  [ENVIRONMENTS.LOCALHOST]: {
    BUILDTYPE: ENVIRONMENTS.LOCALHOST,
    BASE_URL: 'http://localhost:3001',
    API_URL: 'http://localhost:3000',
  },
};
