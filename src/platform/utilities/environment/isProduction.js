const environment = require('./index');

/**
 * Checks to see if the current build-type is a production-ready environment.
 */
export default function isProduction() {
  return environment.isProduction();
}
