/**
 * ENSURE VETS-API IS NOT RUNNING LOCALLY
 * Run mock ezr server using
 * > yarn mock-api --responses ./src/applications/ezr/tests/mock-api.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const delay = require('mocker-api/lib/delay');

const mockSipGet = require('./e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json');
const mockSipPut = require('./e2e/fixtures/mocks/mock-put-progress-forms.json');
const mockUser = require('./e2e/fixtures/mocks/mock-user.json');
const mockEnrollmentStatus = require('./e2e/fixtures/mocks/mock-enrollment-status.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      features: [
        { name: 'loading', value: false },
        { name: 'ezrProdEnabled', value: true },
        { name: 'ezrProvidersAndDependentsPrefillEnabled', value: true },
      ],
    },
  },
  'GET /v0/health_care_applications/enrollment_status': mockEnrollmentStatus,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/in_progress_forms/10-10EZR': mockSipGet,
  'PUT /v0/in_progress_forms/10-10EZR': mockSipPut,
};

module.exports = delay(responses, 200);
