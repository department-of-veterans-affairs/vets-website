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
const mockUserRouteGuard = require('./e2e/fixtures/mocks/mock-user-route-guard.json');
// const mockUserWithLOA1 = require('./e2e/fixtures/mocks/mock-user-with-LOA1.json');
// const mockUserRedirectToMHV = require('./e2e/fixtures/mocks/mock-user-redirect-to-mhv.json');
const mockEnrollmentStatus = require('./e2e/fixtures/mocks/mock-enrollment-status.json');

const responses = {
  'GET /v0/user': mockUserRouteGuard,
  // 'GET /v0/user': mockUserWithLOA1,
  // 'GET /v0/user': mockUserRedirectToMHV,
  'GET /v0/feature_toggles': {
    data: {
      features: [
        { name: 'loading', value: false },
        { name: 'ezrProdEnabled', value: true },
        { name: 'ezrRouteGuardEnabled', value: false },
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
