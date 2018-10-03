const environments = require('./environments');

module.exports = {
  [environments.DEVELOPMENT]: 'https://dev.vets.gov',
  [environments.PREVIEW]: 'https://preview.va.gov',
  [environments.PRODUCTION]: 'https://www.vets.gov',
  [environments.STAGING]: 'https://staging.vets.gov',
  [environments.VAGOVDEV]: 'https://dev.va.gov',
  [environments.VAGOVSTAGING]: 'https://staging.va.gov',
};
