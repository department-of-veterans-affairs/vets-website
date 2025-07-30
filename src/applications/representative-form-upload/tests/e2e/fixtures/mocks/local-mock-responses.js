/* eslint-disable camelcase */
// use this file to mock api responses for local development
const mockUser = require('./loa1-user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockScannedFormUpload = require('./scanned-form-upload.json');
const mockSubmit = require('./submit.json');

const responses = {
  'GET /v0/user': mockUser,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'POST /simple_forms_api/v1/scanned_form_upload': mockScannedFormUpload,
  'POST /simple_forms_api/v1/submit_scanned_form': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
