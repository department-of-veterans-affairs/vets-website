// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/in_progress_forms/22-0803': {},
  'POST /v0/in_progress_forms/22-0803': {},
  'PUT /v0/in_progress_forms/22-0803': {},
  'POST /v0/education_benefits_claims/0803': {
    data: {
      id: '15',
      type: 'education_benefits_claim',
      attributes: {
        form: '{}',
        confirmationNumber: 'V-EBC-15',
      },
    },
  },
};

module.exports = responses;
