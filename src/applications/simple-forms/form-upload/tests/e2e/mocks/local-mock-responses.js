/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/21-0845/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./loa1-user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockScannedFormUpload = require('./scanned-form-upload.json');
const mockUpload = require('./upload.json');

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/FORM-UPLOAD-FLOW': mockSipGet,
  'PUT /v0/in_progress_forms/FORM-UPLOAD-FLOW': mockSipPut,
  'POST /simple_forms_api/v1/scanned_form_upload': mockScannedFormUpload,
  'POST /simple_forms_api/v1/simple_forms/submit_supporting_documents': mockUpload,
  'POST /simple_forms_api/v1/simple_forms': {},
};

module.exports = responses;
/* eslint-enable camelcase */
