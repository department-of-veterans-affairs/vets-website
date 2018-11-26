/*
 * Information on the current environment.
 * @module platform/utilities/environment
 */

const ENVIRONMENTS = require('../../../site/constants/environments');

const RESERVED_E2E_PORT = process.env.WEB_PORT || 3333;
const E2E_API_PORT = process.env.API_PORT;

const ENVIRONMENT_CONFIGURATIONS = {
  [ENVIRONMENTS.VAGOVPROD]: {
    API_URL: 'https://api.va.gov',
    BASE_URL: 'https://www.va.gov',
  },

  [ENVIRONMENTS.VAGOVSTAGING]: {
    API_URL: 'https://staging-api.va.gov',
    BASE_URL: 'https://staging.va.gov',
  },

  [ENVIRONMENTS.VAGOVDEV]: {
    API_URL: 'https://dev-api.va.gov',
    BASE_URL: 'https://dev.va.gov',
  },

  [ENVIRONMENTS.LOCALHOST]: {
    API_URL: `http://${location.hostname}:3000`,
    BASE_URL: `http://${location.hostname}:3001`,
  },
};

const currentEnvironmentConfig =
  ENVIRONMENT_CONFIGURATIONS[process.env.BUILDTYPE];

if (location.port === RESERVED_E2E_PORT) {
  // E2E tests are an edge case - they test a certain build-type,
  // but execute under the localhost hostname.

  const e2eConfig = {
    API_URL: `http://localhost:${E2E_API_PORT}`,
    BASE_URL: `http://localhost:${RESERVED_E2E_PORT}`,
  };

  Object.assign(currentEnvironmentConfig, e2eConfig);
}

module.exports = {
  /**
   * The name of the current environment.
   * @type {string}
   */
  BUILDTYPE: process.env.BUILDTYPE,

  /**
   * The URL of which the FE of the website is currently executing.
   * @type {string}
   */
  BASE_URL: currentEnvironmentConfig.BASE_URL,

  /**
   * The URL of which the API is currently executing.
   * @type {string}
   */
  API_URL: currentEnvironmentConfig.API_URL,

  /**
   * Helper method for determining whether the current environment is considered a production environment.
   * @returns {boolean}
   */
  isProduction() {
    return this.BUILDTYPE === ENVIRONMENTS.VAGOVPROD;
  },

  /**
   * Helper method for determining whether the current environment is considered a staging environment.
   * @returns {boolean}
   */
  isStaging() {
    return this.BUILDTYPE === ENVIRONMENTS.VAGOVSTAGING;
  },

  /**
   * Helper method for determining whether the current environment is considered a dev environment.
   * @returns {boolean}
   */
  isDev() {
    return this.BUILDTYPE === ENVIRONMENTS.VAGOVDEV;
  },

  /**
   * Helper method for determining whether the current environment is considered a local environment.
   * @returns {boolean}
   */
  isLocal() {
    return this.BUILDTYPE === ENVIRONMENTS.LOCALHOST;
  },
};
