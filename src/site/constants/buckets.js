const {
  DEVELOPMENT,
  PRODUCTION,
  STAGING,
  VAGOVDEV,
  VAGOVSTAGING,
  VAGOVPROD,
} = require('./environments');

const hostnames = require('./hostnames');

const bucket = 'https://s3-us-gov-west-1.amazonaws.com';

module.exports = {
  [DEVELOPMENT]: `${bucket}/${hostnames[DEVELOPMENT]}`,
  [PRODUCTION]: `${bucket}/${hostnames[PRODUCTION]}`,
  [STAGING]: `${bucket}/${hostnames[STAGING]}`,
  [VAGOVDEV]: 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  [VAGOVSTAGING]:
    'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  [VAGOVPROD]: 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
};
