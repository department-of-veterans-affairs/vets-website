const {
  LOCALHOST,
  VAGOVDEV,
  VAGOVSTAGING,
  VAGOVPROD,
} = require('./environments');

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
  [LOCALHOST]: DRUPAL_STAGING,
  [VAGOVDEV]: DRUPAL_STAGING,
  [VAGOVSTAGING]: DRUPAL_STAGING,
  [VAGOVPROD]: DRUPAL_LIVE,
};

module.exports = DRUPALS;

module.exports.ENABLED_ENVIRONMENTS = new Set([
  LOCALHOST,
  VAGOVDEV,
  VAGOVSTAGING,
]);

module.exports.PREFIXED_ENVIRONMENTS = new Set([LOCALHOST, VAGOVSTAGING]);
