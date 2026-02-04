/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/ivc-champva/10-10d-extended/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('./feature-toggles.json');
const mockSaveInProgress = require('./save-in-progress.json');
const mockPrefill = require('./prefill.json');
const mockFileUpload = require('./file-upload.json');
const mockSubmission = require('./submission.json');

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/10-10D-EXTENDED': mockPrefill,
  'PUT /v0/in_progress_forms/10-10D-EXTENDED': mockSaveInProgress,
  'POST /ivc_champva/v1/forms/submit_supporting_documents': mockFileUpload,
  'POST /ivc_champva/v1/forms': mockSubmission,
};

module.exports = responses;
/* eslint-enable camelcase */
