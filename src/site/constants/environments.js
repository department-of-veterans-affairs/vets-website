/**
 * All possible values for the environment name, also known as the build-type.
 * @module site/constants/environments
 */

module.exports = {
  /** The local-dev environment. */
  LOCALHOST: 'localhost',

  /** The VA.gov dev environment */
  VAGOVDEV: 'vagovdev',

  /** The VA.gov staging environment. */
  VAGOVSTAGING: 'vagovstaging',

  /** The VA.gov production environment. */
  VAGOVPROD: 'vagovprod',

  /** @deprecated The Vets.gov dev environment. */
  DEVELOPMENT: 'development',

  /** @deprecated The Vets.gov staging environment. */
  STAGING: 'staging',

  /** @deprecated The Vets.gov production environment */
  PRODUCTION: 'production',
};
