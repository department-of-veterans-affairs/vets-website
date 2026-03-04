// use this file to mock api responses for local development
// yarn mock-api --responses src/applications/vre/25-8832/tests/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockSubmit = require('./submit.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/28-8832': mockSipGet,
  'PUT /v0/in_progress_forms/28-8832': mockSipPut,

  // Mock responses for profile and global app requests
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

  'POST /v0/education_career_counseling_claims': mockSubmit,
};

module.exports = responses;
