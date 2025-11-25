// use this file to mock api responses for local development
// yarn mock-api --responses src/applications/new-28-1900/tests/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
// const mockSipUser = require('./user-sip.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const submissionStatues = require('./submission-statuses.json');

const responses = {
  'GET /v0/user': mockUser,
  // 'GET /v0/user': mockSipUser,

  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/27-8832': mockSipGet,
  'PUT /v0/in_progress_forms/27-8832': mockSipPut,

  // // Mock responses for the profile page
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
  'GET /v0/health_care_applications/enrollment_status': {},
  'GET /v0/medical_copays': { data: [] },
  'GET /v0/my_va/submission_statuses': submissionStatues,
  'POST /v0/veteran_readiness_employment_claims': { data: [] },
};

module.exports = responses;
/* eslint-enable camelcase */
