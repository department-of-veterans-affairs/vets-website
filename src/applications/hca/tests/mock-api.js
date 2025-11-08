/**
 * ENSURE VETS-API IS NOT RUNNING LOCALLY
 * Run mock hca server using
 * > yarn mock-api --responses ./src/applications/hca/tests/mock-api.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const path = require('path');
const fs = require('fs');
const delay = require('mocker-api/lib/delay');
// const mockSipGet = require('./e2e/fixtures/mocks/user.noPrefill.json');
// const mockSipPut = require('./e2e/fixtures/mocks/user.inProgressForm.json');
const mockUser = require('./e2e/fixtures/mocks/user.json');
const mockEnrollmentStatus = require('./e2e/fixtures/mocks/enrollment-status.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      features: [{ name: 'loading', value: false }],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': { mockEnrollmentStatus },

  // 'GET /v0/health_care_applications/rating_info': mockSipGet,
  // 'GET /v0/in_progress_forms/10-10EZ': mockSipGet,
  // 'PUT /v0/in_progress_forms/10-10EZ': mockSipPut,
  'POST /v0/health_care_applications/enrollment_status': (req, res) => {
    res.status(404);
    res.setHeader('Content-Type', 'application/json');
    res.send(mockEnrollmentStatus.body);
  },
  'POST `/v0/health_care_applications/download_pdf': (req, res) => {
    const pdfPath = path.join(__dirname, './e2e/fixtures/mocks/mock.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);

    res.status(200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="mock.pdf"');
    res.send(pdfBuffer);
  },
  'POST /v0/form1010': {
    success: true,
    formSubmissionId: null,
    timestamp: null,
  },
};

module.exports = delay(responses, 200);
