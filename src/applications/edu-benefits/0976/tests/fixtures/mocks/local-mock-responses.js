// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const institutionSuccess = require('./institution-facility-code-success.json');
const institutionFail = require('./institution-facility-code-fail.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/gi/institutions/12345678': institutionSuccess,
  'GET /v0/gi/institutions/87654321': (_req, res) => {
    res.status(404).json(institutionFail);
  },
};

module.exports = responses;
