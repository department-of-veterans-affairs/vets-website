const {
  DEVELOPMENT,
  PREVIEW,
  PRODUCTION,
  STAGING,
  VAGOVDEV,
  VAGOVSTAGING,
} = require('./environments');

const hostnames = require('./hostnames');

const bucket = 'https://s3-us-gov-west-1.amazonaws.com';

module.exports = {
  [DEVELOPMENT]: `${bucket}/${hostnames[DEVELOPMENT]}`,
  [PREVIEW]: `${bucket}/${hostnames[PREVIEW]}`,
  [PRODUCTION]: `${bucket}/${hostnames[PRODUCTION]}`,
  [STAGING]: `${bucket}/${hostnames[STAGING]}`,
  [VAGOVDEV]: `${bucket}/${hostnames[VAGOVDEV]}`,
  [VAGOVSTAGING]: `${bucket}/${hostnames[VAGOVSTAGING]}`,
};
