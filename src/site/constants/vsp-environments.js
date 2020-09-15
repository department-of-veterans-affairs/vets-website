/*
 * Export string mapped to the current environment for Sentry tagging. Workaround until:
 * https://github.com/department-of-veterans-affairs/va.gov-team/issues/13425
 */

const environments = require('./environments');

export default Object.freeze({
  [environments.LOCALHOST]: 'localhost',
  [environments.VAGOVDEV]: 'development',
  [environments.VAGOVSTAGING]: 'staging',
  [environments.VAGOVPROD]: 'production',
});
