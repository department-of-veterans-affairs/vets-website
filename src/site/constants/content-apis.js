const ENVIRONMENTS = require('./environments');

module.exports = {
  [ENVIRONMENTS.LOCALHOST]: 'http://dev.va.agile6.com',
  [ENVIRONMENTS.VAGOVDEV]: 'http://dev.va.agile6.com',
  [ENVIRONMENTS.VAGOVSTAGING]: 'http://staging.va.agile6.com',
  [ENVIRONMENTS.VAGOVPROD]: 'http://vagovcms.lndo.site',
};
