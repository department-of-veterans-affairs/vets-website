/*
 * Information on the current environment.
 * @module platform/utilities/environment
 */

import ENVIRONMENTS from '../../../site/constants/environments';

const {
  WEB_PORT: RESERVED_E2E_PORT = 3333,
  API_PORT: E2E_API_PORT = 3000,
  BUILDTYPE = ENVIRONMENTS.LOCALHOST,
} = process.env;

const ENVIRONMENT_CONFIGURATIONS = {
  [ENVIRONMENTS.VAGOVPROD]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVPROD,
    API_URL: 'https://api.va.gov',
    BASE_URL: 'https://www.va.gov',
  },

  [ENVIRONMENTS.VAGOVSTAGING]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVSTAGING,
    API_URL: 'https://staging-api.va.gov',
    BASE_URL: 'https://staging.va.gov',
  },

  [ENVIRONMENTS.VAGOVDEV]: {
    BUILDTYPE: ENVIRONMENTS.VAGOVDEV,
    API_URL: 'https://dev-api.va.gov',
    BASE_URL: 'https://dev.va.gov',
  },

  [ENVIRONMENTS.LOCALHOST]: {
    BUILDTYPE: ENVIRONMENTS.LOCALHOST,
    API_URL: `http://${location.hostname}:3000`,
    BASE_URL: `http://${location.hostname}:3001`,
  },
};

const currentEnvConfig = ENVIRONMENT_CONFIGURATIONS[BUILDTYPE];

if (location.port === RESERVED_E2E_PORT) {
  // E2E tests are an edge case - they test a certain build-type,
  // but execute under the localhost hostname.

  const e2eConfig = {
    API_URL: `http://localhost:${E2E_API_PORT}`,
    BASE_URL: `http://localhost:${RESERVED_E2E_PORT}`,
  };

  Object.assign(currentEnvConfig, e2eConfig);
}

/**
 * Determines whether the current environment is a production environment.
 * @returns {boolean}
 */
export function isProduction() {
  return BUILDTYPE === ENVIRONMENTS.VAGOVPROD;
}

/**
 * Determines whether the current environment is a staging environment.
 * @returns {boolean}
 */
export function isStaging() {
  return BUILDTYPE === ENVIRONMENTS.VAGOVSTAGING;
}

/**
 * Determines whether the current environment is a dev environment.
 * @returns {boolean}
 */
export function isDev() {
  return BUILDTYPE === ENVIRONMENTS.VAGOVDEV;
}

/**
 * Determines whether the current environment is a local environment.
 * @returns {boolean}
 */
export function isLocal() {
  return BUILDTYPE === ENVIRONMENTS.LOCALHOST;
}

export default currentEnvConfig;
