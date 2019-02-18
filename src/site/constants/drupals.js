const ENVIRONMENTS = require('./environments');

const DRUPAL_DEV = {
  address: 'http://staging.va.agile6.com',
  credentials: {
    username: 'api',
    password: 'drupal8',
  },
};

const DRUPAL_STAGING = {
  address: 'http://staging.va.agile6.com',
  credentials: {
    username: 'api',
    password: 'drupal8',
  },
};

const DRUPAL_LIVE = {
  address: 'http://vagovcms.lndo.site',
  credentials: {},
};

/**
 * The decoupled-Drupal API locations by environment
 * These should be considered very temporary, because their locations will definitely change as
 * the Drupal integration continues.
 * @module site/constants/drupals
 */
const DRUPALS = {
  [ENVIRONMENTS.LOCALHOST]: DRUPAL_DEV,
  [ENVIRONMENTS.VAGOVDEV]: DRUPAL_DEV,
  [ENVIRONMENTS.VAGOVSTAGING]: DRUPAL_STAGING,
  [ENVIRONMENTS.VAGOVPROD]: DRUPAL_LIVE,
};

module.exports = DRUPALS;
