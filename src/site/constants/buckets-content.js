const {
  LOCALHOST,
  VAGOVDEV,
  VAGOVSTAGING,
  VAGOVPROD,
} = require('./environments');

const prodBucket = 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov';
const stagingBucket =
  'https://s3-us-gov-west-1.amazonaws.com/content.staging.va.gov';
const devBucket = 'https://s3-us-gov-west-1.amazonaws.com/content.dev.va.gov';

module.exports = {
  [VAGOVDEV]: devBucket,
  [VAGOVSTAGING]: stagingBucket,
  [VAGOVPROD]: prodBucket,
  [LOCALHOST]: devBucket,
};
