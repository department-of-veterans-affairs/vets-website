const ENVIRONMENTS = require('./environments');

/**
 * The decoupled-Drupal API locations by environment
 * These should be considered very temporary, because their locations will definitely change as
 * the Drupal integration continues.
 * @module site/constants/drupals
 */
module.exports = {
  [ENVIRONMENTS.LOCALHOST]: 'http://dev.va.agile6.com',
  [ENVIRONMENTS.VAGOVDEV]: 'http://dev.va.agile6.com',
  [ENVIRONMENTS.VAGOVSTAGING]: 'http://staging.va.agile6.com',
  [ENVIRONMENTS.VAGOVPROD]: 'http://vagovcms.lndo.site',
};
