/* eslint-disable camelcase */
const mockUser = require('./user.json');

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'form210966', value: true }],
    },
  },
};

module.exports = responses;
