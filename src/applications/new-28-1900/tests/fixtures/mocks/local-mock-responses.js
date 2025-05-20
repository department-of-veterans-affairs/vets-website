// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockSubmissionStatuses = require('./submission-statuses.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/in_progress_forms/28-1900-V2': mockSipGet,
  'PUT /v0/in_progress_forms/28-1900-V2': mockSipPut,
  // Mock responses for the profile page
  'GET /v0/profile/full_name': {
    id: '',
    type: 'hashes',
    attributes: {
      first: 'Mitchell',
      middle: 'G',
      last: 'Jenkins',
      suffix: null,
    },
  },
  'GET /v0/onsite_notifications': { data: [] },
  'GET /v0/debts': { data: [] },
  'GET /v0/health_care_applications/enrollment_status': {
    applicationDate: '2006-01-30T00:00:00.000-06:00',
    enrollmentDate: '2006-03-20T00:00:00.000-06:00',
    preferredFacility: '626A4 - ALVIN C. YORK VAMC',
    effectiveDate: '2018-04-28T18:21:56.000-05:00',
    parsedStatus: 'enrolled',
  },
  'GET /v0/medical_copays': { data: [] },
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': { data: [] },

  'GET /v0/my_va/submission_statuses': mockSubmissionStatuses,
};

module.exports = responses;
