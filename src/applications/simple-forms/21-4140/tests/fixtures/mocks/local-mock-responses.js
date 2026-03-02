// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'form218940',
          value: true,
        },
        {
          name: 'form218940_validate_email_presence',
          value: true,
        },
       
      ],
    },
  },
};


module.exports = responses;
