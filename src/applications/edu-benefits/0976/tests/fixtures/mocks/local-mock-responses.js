// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const institutionSuccess1 = require('./institution-facility-code-success1.json');
const institutionSuccess2 = require('./institution-facility-code-success2.json');
const institutionSuccess3 = require('./institution-facility-code-success3.json');
const institutionFail = require('./institution-facility-code-fail.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/gi/institutions/11111111': institutionSuccess1,
  'GET /v0/gi/institutions/22222222': institutionSuccess2,
  'GET /v0/gi/institutions/33333333': institutionSuccess3,
  'GET /v0/gi/institutions/87654321': (_req, res) => {
    res.status(404).json(institutionFail);
  },
};

module.exports = responses;
