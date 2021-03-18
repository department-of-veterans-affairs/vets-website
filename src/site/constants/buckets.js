const { VAGOVDEV, VAGOVSTAGING, VAGOVPROD } = require('./environments');

module.exports = {
  [VAGOVDEV]: 'https://s3-us-gov-west-1.amazonaws.com/apps.dev.va.gov',
  [VAGOVSTAGING]:
    'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  [VAGOVPROD]: 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
};
