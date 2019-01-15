const ENVIRONMENTS = require('./environments');

const DRUPAL_STAGING = 'http://staging.va.agile6.com';

/**
 * The decoupled-Drupal API locations by environment
 * These should be considered very temporary, because their locations will definitely change as
 * the Drupal integration continues.
 * @module site/constants/drupals
 */
const DRUPALS = {
  [ENVIRONMENTS.LOCALHOST]: DRUPAL_STAGING,
  [ENVIRONMENTS.VAGOVDEV]: DRUPAL_STAGING,
  [ENVIRONMENTS.VAGOVSTAGING]: DRUPAL_STAGING,
  [ENVIRONMENTS.VAGOVPROD]: 'http://vagovcms.lndo.site',
};

DRUPALS.CREDENTIALS = {
  [DRUPAL_STAGING]: {
    username: 'api',
    password: 'drupal8',
  },
};

module.exports = DRUPALS;
