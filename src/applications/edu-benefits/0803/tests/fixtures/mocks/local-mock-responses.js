// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/in_progress_forms/22-0803': {},
  'POST /v0/in_progress_forms/22-0803': {},
  'PUT /v0/in_progress_forms/22-0803': {},
};

module.exports = responses;
