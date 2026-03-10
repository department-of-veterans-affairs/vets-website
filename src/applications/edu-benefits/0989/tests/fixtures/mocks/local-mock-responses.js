// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const prefilledForm = require('./prefilled-form.json');
const applicationSubmit = require('./application-submit.json');
const sip = require('./sip-put.json');
const featureToggles = require('./feature-toggles.json');

const responses = {
  'GET /v0/user': mockUser,
  'PUT /v0/in_progress_forms/22-0989': sip,
  'GET /v0/in_progress_forms/22-0989': prefilledForm,
  'POST /v0/education_benefits_claims/0989': applicationSubmit,
  'GET /v0/feature_toggles': featureToggles,
  'GET /data/cms/vamc-ehr.json': {},
};

module.exports = responses;
