/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/mock-simple-forms-patterns-v3/tests/e2e/fixtures/mocks/local-mock-responses.js

const mockUser = require('./user.json');
// const mockUser2 = require('../../../../mocks/constants/user');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockSubmit = require('./submit.json');

// Import prefill data from the mocks directory (uncomment and use as needed)
// const {
//   prefill,
//   prefillMaximal,
// } = require('../../../../mocks/endpoints/in-progress-forms/mock-simple-forms-patterns-v3');

const responses = {
  'GET /v0/user': mockUser,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/FORM_MOCK_PATTERNS_V3': mockSipGet,
  'PUT /v0/in_progress_forms/FORM_MOCK_PATTERNS_V3': mockSipPut,
  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
