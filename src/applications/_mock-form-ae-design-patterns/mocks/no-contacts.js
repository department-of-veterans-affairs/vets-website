const { loa3UserWithNoContactInfo } = require('./endpoints/user');
const baseResponses = require('./server');

module.exports = {
  ...baseResponses,
  'GET /v0/user': (req, res) => {
    return res.json(loa3UserWithNoContactInfo);
  },
};
