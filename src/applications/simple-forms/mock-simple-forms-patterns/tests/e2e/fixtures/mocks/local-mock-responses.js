const user = require('./user.json');
const mockSubmit = require('./form-submit.json');
const mockFeatureToggles = require('./featureToggles.json');
const sipGetMissingInfoYesNo = require('./sip-get-missing-info-yes-no.json');
const sipPut = require('./sip-put.json');

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/in_progress_forms/FORM_MOCK_SF_PATTERNS': sipGetMissingInfoYesNo,
  'PUT /v0/in_progress_forms/FORM_MOCK_SF_PATTERNS': sipPut,
  'GET /v0/user': user,
  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
