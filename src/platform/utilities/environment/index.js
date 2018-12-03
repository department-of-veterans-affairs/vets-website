/*
 * Configuration for the current environment.
 * @module platform/utilities/environment
 */

import ENVIRONMENTS from 'site/constants/environments';

// __BUILDTYPE__ is defined as a global variable in our Webpack config, ultimately used
// to indicate the name of our current environment as passed from our build script. This should
// be the only reference to this value throughout our client-side code. Other modules should
// instead import this module and interface with it instead.

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
    BASE_URL: `http://${location.hostname}${
      location.port ? `:${location.port}` : ''
    }`,
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

export default Object.freeze({
  /**
   * The name of the environment under which the site is currently executing.
   * Rather than checking this value directly, you should consider using one of
   * the helper functions for checking the environment instead. However, if you choose
   * to do so, you should import the environment names from module:site/constants/environments
   * and compare it using the constants defined there.
   * */
  BUILDTYPE: environment.BUILDTYPE,

  /** The address of the FE website configured for this environment. */
  BASE_URL: environment.BASE_URL,

  /**
   * The address of the API configured for this environment. Rather than using this directly,
   * you should instead consider using the API helper function defined in
   * platform/utilities/api to fetch data.
   */
  API_URL: environment.API_URL,

  /** Determines whether the current environment is a production environment. */
  isProduction() {
    return environment.BUILDTYPE === ENVIRONMENTS.VAGOVPROD;
  },

  /** Determines whether the current environment is a staging environment. */
  isStaging() {
    return environment.BUILDTYPE === ENVIRONMENTS.VAGOVSTAGING;
  },

  /** Determines whether the current environment is a dev environment. */
  isDev() {
    return environment.BUILDTYPE === ENVIRONMENTS.VAGOVDEV;
  },

  /** Determines whether the current environment is a local environment. */
  isLocalhost() {
    return environment.BUILDTYPE === ENVIRONMENTS.LOCALHOST;
  },
});
