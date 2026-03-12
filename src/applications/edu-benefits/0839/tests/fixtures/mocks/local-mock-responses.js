// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const prefilledForm = require('./prefilled-form.json');
const sip = require('./sip-put.json');

const responses = {
  'GET /v0/user': mockUser,
  'PUT /v0/in_progress_forms/22-0839': sip,
  'GET /v0/in_progress_forms/22-0839': prefilledForm,
};

module.exports = responses;
