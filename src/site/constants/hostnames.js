const environments = require('./environments');

module.exports = {
  [environments.LOCALHOST]: 'localhost',
  [environments.VAGOVDEV]: 'dev.va.gov',
  [environments.VAGOVSTAGING]: 'staging.va.gov',
  [environments.VAGOVPROD]: 'www.va.gov',
};
