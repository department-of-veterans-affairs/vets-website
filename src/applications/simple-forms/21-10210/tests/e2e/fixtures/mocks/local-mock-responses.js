/* eslint-disable camelcase */
// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/simple-forms/21-0972/tests/e2e/fixtures/mocks/local-mock-responses.js
const featureToggles = require('../../../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json');
const user = require('./user.json');
// const mockSipPut = require('./sipPut.json');
// const mockSipGet = require('./sipGet.json');
const mockSubmit = require('../../../../../shared/tests/e2e/fixtures/mocks/application-submit.json');

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': featureToggles,
  'GET /v0/user': user,
  // 'GET /v0/in_progress_forms/21-4142': mockSipGet,
  // 'PUT /v0/in_progress_forms/21-4142': mockSipPut,
  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
/* eslint-enable camelcase */
