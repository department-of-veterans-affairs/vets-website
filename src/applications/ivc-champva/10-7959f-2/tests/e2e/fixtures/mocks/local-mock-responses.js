/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/ivc-champva/10-7959f-2/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockStatuses = require('./form-statuses-no-errors.json');

const mockSubmit = {
  confirmationNumber: '48fac28c-b332-4549-a45b-3423297111f4',
};

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/10-7959F-2': mockSipGet,
  'GET /v0/my_va/submission_statuses': mockStatuses,
  'PUT /v0/in_progress_forms/10-7959F-2': mockSipPut,
  'POST /ivc_champva/v1/forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
