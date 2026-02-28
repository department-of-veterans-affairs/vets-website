// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'form214140',
          value: true,
        },
        {
          name: 'form214140_validate_email_presence',
          value: false,
        },
        {
          name: 'form214140_validate_dob',
          value: false,
        },
      ],
    },
  },
};

module.exports = responses;
