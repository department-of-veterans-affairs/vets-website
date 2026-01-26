// use this file to mock api responses for local development
// yarn mock-api --responses src/applications/lgy/coe/form/tests/fixtures/mocks/local-mock-responses.js

const mockUser = require('./user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');

const responses = {
  'GET /v0/user': mockUser,

  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/26-1880': mockSipGet,
  'PUT /v0/in_progress_forms/26-1880': mockSipPut,
  'GET /v0/onsite_notifications': { data: [] },
  'GET /v0/debts': { data: [] },
  'GET /v0/health_care_applications/enrollment_status': {},
  'GET /v0/medical_copays': { data: [] },
  'POST /v0/profile/telephones': {
    data: {
      attributes: {},
    },
  },
  'POST /v0/profile/email_addresses': {
    data: {
      attributes: {},
    },
  },
};
module.exports = responses;
