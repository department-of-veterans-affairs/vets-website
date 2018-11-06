const environments = require('./environments');

module.exports = {
  [environments.DEVELOPMENT]: 'dev.vets.gov',
  [environments.PREVIEW]: 'preview.va.gov',
  [environments.PRODUCTION]: 'www.vets.gov',
  [environments.STAGING]: 'staging.vets.gov',
  [environments.VAGOVDEV]: 'dev.va.gov',
  [environments.VAGOVSTAGING]: 'staging.va.gov',
  [environments.VAGOVPROD]: 'www.va.gov',
};
