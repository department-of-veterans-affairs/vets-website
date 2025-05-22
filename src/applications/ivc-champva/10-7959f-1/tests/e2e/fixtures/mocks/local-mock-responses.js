// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/ivc-champva/10-7959f-1/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const mockFeatureToggles = require('./featureToggles.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');
const mockUpload = require('./upload.json');

const mockSubmit = {
  confirmationNumber: '48fac28c-b332-4549-a45b-3423297111f4',
};

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/in_progress_forms/10-7959F-1': mockSipGet,
  'PUT /v0/in_progress_forms/10-7959F-1': mockSipPut,
  'POST /ivc_champva/v1/forms/submit_supporting_documents': mockUpload,
  'POST /ivc_champva/v1/forms': mockSubmit,

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
};

module.exports = responses;
/* eslint-enable camelcase */
