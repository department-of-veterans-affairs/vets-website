const ENVIRONMENTS = require('./environments');

// eslint-disable-next-line no-unused-vars
const DRUPAL_DEV = {
  address: 'http://dev.cms.va.gov',
  user: 'api',
  password: 'drupal8',
};

const DRUPAL_STAGING = {
  address: 'http://staging.cms.va.gov',
  user: 'api',
  password: 'drupal8',
};

const DRUPAL_PROD = {
  address: 'http://prod.cms.va.gov',
  user: 'api',
  password: 'drupal8',
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
  [ENVIRONMENTS.VAGOVPROD]: DRUPAL_PROD,
};

const ENABLED_ENVIRONMENTS = new Set([
  ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVDEV,
  ENVIRONMENTS.VAGOVSTAGING,
  ENVIRONMENTS.VAGOVPROD,
]);

const PREFIXED_ENVIRONMENTS = new Set([
  // ENVIRONMENTS.LOCALHOST,
  // ENVIRONMENTS.VAGOVSTAGING,
  // ENVIRONMENTS.VAGOVPROD,
]);

const PUBLIC_URLS = {
  'http://internal-dev-vagovcms-3000-552087943.us-gov-west-1.elb.amazonaws.com':
    'http://dev.cms.va.gov',
  'http://internal-stg-vagovcms-3000-521598752.us-gov-west-1.elb.amazonaws.com':
    'http://staging.cms.va.gov',
  'http://internal-prod-vagovcms-3000-1370756925.us-gov-west-1.elb.amazonaws.com':
    'http://prod.cms.va.gov',
};

module.exports = DRUPALS;
module.exports.ENABLED_ENVIRONMENTS = ENABLED_ENVIRONMENTS;
module.exports.PREFIXED_ENVIRONMENTS = PREFIXED_ENVIRONMENTS;
module.exports.PUBLIC_URLS = PUBLIC_URLS;
