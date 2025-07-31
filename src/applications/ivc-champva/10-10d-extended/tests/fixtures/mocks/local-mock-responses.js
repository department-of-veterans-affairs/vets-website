// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('../../e2e/fixtures/mocks/featureToggles.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': mockFeatureToggles,
};

module.exports = responses;
