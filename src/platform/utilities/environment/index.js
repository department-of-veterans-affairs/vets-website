/*
 * Configuration for the current environment.
 * @module platform/utilities/environment
 */

import ENVIRONMENTS from '../../../site/constants/environments';

// eslint-disable-next-line no-undef
const BUILDTYPE = __BUILDTYPE__;

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
    BASE_URL: `http://${location.hostname}:${location.port}`,
    API_URL: `http://${location.hostname}:3000`,
  },
};

const environment = ENVIRONMENT_CONFIGURATIONS[BUILDTYPE];
const isPort80 = location.port === '' || location.port === 80;

if (!isPort80) {
  // It's possible that we're executing a certain build-type under a hostname
  // other than the host that it's configured. This is the case for integration tests,
  // where we're testing the vagovprod (production) build-type by serving the production-compiled files,
  // but on a server running under localhost. This would also be the case if we're testing the
  // production environment on our local machines.
  const LOCALHOST_ENV = ENVIRONMENT_CONFIGURATIONS[ENVIRONMENTS.LOCALHOST];
  environment.API_URL = LOCALHOST_ENV.API_URL;
  environment.BASE_URL = LOCALHOST_ENV.BASE_URL;
}

export default {
  /** The name of the environment under which the site is currently executing. */
  BUILDTYPE: environment.BUILDTYPE,

  /** The address of the FE website configured for this environment. */
  BASE_URL: environment.BASE_URL,

  /** The address of the API configured for this environment. */
  API_URL: environment.API_URL,

  /** Determines whether the current environment is a production environment. */
  isProduction() {
    return this.BUILDTYPE === ENVIRONMENTS.VAGOVPROD;
  },

  /** Determines whether the current environment is a staging environment. */
  isStaging() {
    return this.BUILDTYPE === ENVIRONMENTS.VAGOVSTAGING;
  },

  /** Determines whether the current environment is a dev environment. */
  isDev() {
    return this.BUILDTYPE === ENVIRONMENTS.VAGOVDEV;
  },

  /** Determines whether the current environment is a local environment. */
  isLocalhost() {
    return this.BUILDTYPE === ENVIRONMENTS.LOCALHOST;
  },
};
