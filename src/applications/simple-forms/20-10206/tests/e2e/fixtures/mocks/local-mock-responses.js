/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/21-0845/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sipPut.json');
const mockSipGet = require('./sipGet.json');
const mockSubmit = require('../../../../../shared/tests/e2e/fixtures/mocks/application-submit.json');

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': mockFeatureToggles,

  'GET /v0/in_progress_forms/20-10206': mockSipGet,
  'PUT /v0/in_progress_forms/20-10206': mockSipPut,

  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
