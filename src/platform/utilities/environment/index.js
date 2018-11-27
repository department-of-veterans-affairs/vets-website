/*
 * Information on the current environment.
 * @module platform/utilities/environment
 */

import ENVIRONMENTS from '../../../site/constants/environments';

const {
  WEB_PORT: RESERVED_E2E_PORT = 3333,
  API_PORT: E2E_API_PORT = 3000,
  BUILDTYPE = ENVIRONMENTS.VAGOVDEV,
} = process.env;

const ENVIRONMENT_CONFIGURATIONS = {
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
    BASE_URL: `http://${location.hostname}:3001`,
    API_URL: `http://${location.hostname}:3000`,
  },
};

const environment = ENVIRONMENT_CONFIGURATIONS[BUILDTYPE];

if (location.port === RESERVED_E2E_PORT) {
  // E2E tests are an edge case - they test a certain build-type,
  // but execute under the localhost hostname.

  const e2eConfig = {
    API_URL: `http://localhost:${E2E_API_PORT}`,
    BASE_URL: `http://localhost:${RESERVED_E2E_PORT}`,
  };

  Object.assign(environment, e2eConfig);
}

/** Determines whether the current environment is a production environment. */
export function isProduction() {
  return BUILDTYPE === ENVIRONMENTS.VAGOVPROD;
}

/** Determines whether the current environment is a staging environment. */
export function isStaging() {
  return BUILDTYPE === ENVIRONMENTS.VAGOVSTAGING;
}

/** Determines whether the current environment is a dev environment. */
export function isDev() {
  return BUILDTYPE === ENVIRONMENTS.VAGOVDEV;
}

/** Determines whether the current environment is a local environment. */
export function isLocal() {
  return BUILDTYPE === ENVIRONMENTS.LOCALHOST;
}

export default {
  /** The name of the environment under which the site is currently executing. */
  BUILDTYPE: environment.BUILDTYPE,
  /** The address of the FE website configured for this environment. */
  BASE_URL: environment.BASE_URL,
  /** The address of the API configured for this environment. */
  API_URL: environment.API_URL,
};
