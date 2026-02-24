/* eslint-disable camelcase */
// yarn mock-api --responses ./src/applications/simple-forms/21-4138/tests/e2e/fixtures/mocks/local-mock-responses-non-veteran.js
const mockUser = require('./user-non-veteran.json');
const mockSipGet = require('./sip-get-4138-non-veteran.json');
const mockSipPut = require('./sip-put-4138.json');

const responses = {
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/in_progress_forms/21-4138': mockSipGet,
  'PUT /v0/in_progress_forms/21-4138': mockSipPut,
};

module.exports = responses;
/* eslint-enable camelcase */
