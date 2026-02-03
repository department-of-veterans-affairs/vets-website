/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/ivc-champva/10-7959C/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockUpload = require('./upload.json');

const mockSubmit = {
  confirmationNumber: '48fac28c-b332-4549-a45b-3423297111f4',
};

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/10-7959c': mockSipGet,
  'PUT /v0/in_progress_forms/10-7959c': mockSipPut,
  'POST /ivc_champva/v1/forms/submit_supporting_documents': mockUpload,
  'POST /ivc_champva/v1/forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
