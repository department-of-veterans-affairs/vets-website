/*
 * Configuration for the current environment.
 * @module platform/utilities/environment
 */

import ENVIRONMENTS from 'site/constants/environments';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';

/* Separate constants as workaround for Sentry environments rollout until completion of
 * https://github.com/department-of-veterans-affairs/va.gov-team/issues/13425
 */
import VSP_ENVIRONMENTS from 'site/constants/vsp-environments';

// __BUILDTYPE__ is defined as a global variable in our Webpack config, ultimately used
// to indicate the name of our current environment as passed from our build script. This should
// be the only reference to this value throughout our client-side code. Other modules should
// instead import this module and interface with it instead.
const BUILDTYPE = __BUILDTYPE__;

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

if (environment.BUILDTYPE === ENVIRONMENTS.LOCALHOST) {
  // __API__ is defined the same way as __BUILDTYPE__, and is used to indicate the URL of the VA API. The main use
  // case for this at the moment is for internal review instances to pass configuration during the build.
  const CUSTOM_API = __API__;
  if (CUSTOM_API) environment.API_URL = CUSTOM_API;
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

  /**
   * Workaround to map existing environments to normalized string until completion of:
   * https://github.com/department-of-veterans-affairs/va.gov-team/issues/13425
   */
  vspEnvironment() {
    return VSP_ENVIRONMENTS[environment.BUILDTYPE];
  },

  /**
   * Determines whether the current environment is a production environment.
   *
   * NB: this returns true in e2e (Cypress) tests, as they are run on
   *     a production build.
   */
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

  /**
   * Determines whether the current environment is a local environment.
   *
   * NB: this returns false in e2e (Cypress) tests, as they are run on
   *     a production build.
   */
  isLocalhost() {
    return environment.BUILDTYPE === ENVIRONMENTS.LOCALHOST;
  },

  /** Workaround for testing/using components accross different enviroments */
  getRawBuildtype() {
    return __BUILDTYPE__;
  },

  isTest() {
    return !!(
      window?.Cypress ||
      window?.Mocha ||
      process?.env?.NODE_ENV === 'test'
    );
  },

  isUnitTest() {
    return !!(window?.Mocha || process?.env?.NODE_ENV === 'test');
  },
});
