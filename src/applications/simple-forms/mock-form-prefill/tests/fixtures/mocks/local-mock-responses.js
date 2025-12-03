// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/mock-form-prefill/tests/fixtures/mocks/local-mock-responses.js

const mockUser = require('./user.json');
const mockFeatureToggles = require('./feature-toggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockSubmit = require('./application-submit.json');

const responses = {
  'GET /v0/user': mockUser,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/FORM_MOCK_PREFILL': mockSipGet,
  'PUT /v0/in_progress_forms/FORM_MOCK_PREFILL': mockSipPut,
  'POST /v0/api': mockSubmit,
};

module.exports = responses;
