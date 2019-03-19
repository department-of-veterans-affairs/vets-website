const ENVIRONMENTS = require('./environments');

// eslint-disable-next-line no-unused-vars
const DRUPAL_DEV = {
  address: 'http://dev.va.agile6.com',
  user: 'api',
  password: 'drupal8',
};

const DRUPAL_STAGING = {
  address: 'http://stg.va.agile6.com',
  user: 'api',
  password: 'drupal8',
};

const DRUPAL_LIVE = {
  address: 'http://vagovcms.lndo.site',
};

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
  [ENVIRONMENTS.VAGOVPROD]: DRUPAL_LIVE,
};

const ENABLED_ENVIRONMENTS = new Set([
  ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVDEV,
  ENVIRONMENTS.VAGOVSTAGING,
]);

const PREFIXED_ENVIRONMENTS = new Set([
  // ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVSTAGING,
]);

module.exports = DRUPALS;
module.exports.ENABLED_ENVIRONMENTS = ENABLED_ENVIRONMENTS;
module.exports.PREFIXED_ENVIRONMENTS = PREFIXED_ENVIRONMENTS;
