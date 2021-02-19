const {
  VAGOVDEV,
  VAGOVSTAGING,
  VAGOVPROD,
  VAGOVDEVGRAPHQL,
} = require('./environments');

module.exports = {
  [VAGOVDEV]: 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  [VAGOVDEVGRAPHQL]: 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  [VAGOVSTAGING]:
    'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  [VAGOVPROD]: 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
};
