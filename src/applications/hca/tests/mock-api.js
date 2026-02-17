/**
 * Local development mock API for HCA
 * ENSURE VETS-API IS NOT RUNNING LOCALLY
 *
 * Setup:
 * 1. Run mock hca server:
 *    > yarn mock-api --responses ./src/applications/hca/tests/mock-api.js
 * 2. In browser console, enable mock session:
 *    > localStorage.setItem('hasSession', true)
 * 3. Access the form at http://localhost:3001/health-care/apply/application/introduction
 */
const delay = require('mocker-api/lib/delay');
const mockEnrollmentStatus = require('./e2e/fixtures/mocks/enrollment-status.auth.json');
const mockFacilities = require('./e2e/fixtures/mocks/facilities.json');
const mockFeatureToggles = require('./e2e/fixtures/mocks/feature-toggles.json');
const mockMaintenanceWindows = require('./e2e/fixtures/mocks/maintenance-windows.json');
const mockPrefill = require('./e2e/fixtures/mocks/prefill.json');
const mockSaveInProgress = require('./e2e/fixtures/mocks/save-in-progress.json');
const mockSubmission = require('./e2e/fixtures/mocks/submission.json');
const mockUser = require('./e2e/fixtures/mocks/user.json');
const mockVamc = require('./e2e/fixtures/mocks/vamc-ehr.json');

const mockPdfDownload = (_req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="mock.pdf"');
  res.send('Fake 10-10EZ Form for Mickey Mouse');
};

const mockRating = (rating = 0) => ({
  data: {
    id: '',
    type: 'hash',
    attributes: { userPercentOfDisability: rating },
  },
});

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': mockFeatureToggles,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': mockMaintenanceWindows,
  'GET /data/cms/vamc-ehr.json': mockVamc,

  'GET /v0/in_progress_forms/1010ez': mockPrefill.body,
  'PUT /v0/in_progress_forms/1010ez': mockSaveInProgress.body,

  'GET /v0/health_care_applications/rating_info': mockRating(),
  'GET /v0/health_care_applications/facilities': mockFacilities,
  'POST /v0/health_care_applications/enrollment_status':
    mockEnrollmentStatus.body,
  'POST /v0/health_care_applications/download_pdf': mockPdfDownload,
  'POST /v0/health_care_applications': mockSubmission.body,
};

module.exports = delay(responses, 200);
