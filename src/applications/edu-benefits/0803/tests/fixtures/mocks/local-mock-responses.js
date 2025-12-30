// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const prefillInfo = require('./prefill-info.json');
const user = require('./user.json');
const sip = require('./sip.json');

const responses = {
  'GET /v0/in_progress_forms/22-0803': prefillInfo,
  'PUT /v0/in_progress_forms/22-0803': sip,
  'GET /v0/user': user,
};

module.exports = responses;
