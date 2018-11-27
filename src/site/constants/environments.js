/**
 * All possible values for the environment name, also known as the build-type.
 * @module site/constants/environments
 */

module.exports = {
  LOCALHOST: 'localhost',
  VAGOVDEV: 'vagovdev',
  VAGOVSTAGING: 'vagovstaging',
  VAGOVPROD: 'vagovprod',

  /** @deprecated The Vets.gov dev environment. */
  DEVELOPMENT: 'development',

  /** @deprecated The Vets.gov staging environment. */
  STAGING: 'staging',

  /** @deprecated The Vets.gov production environment */
  PRODUCTION: 'production',
};
