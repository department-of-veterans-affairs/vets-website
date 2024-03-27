/* eslint-disable camelcase */
const commonResponses = require('../../../../../../../platform/testing/local-dev-mock-api/common');

const mockFeatures = require('../../../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json');
const mockSipGet = require('./in-progress-forms-get.json');
const mockSipPut = require('./in-progress-forms-put.json');
const mockUpload = require('./upload.json');
const mockSubmission = require('./submission.json');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': mockFeatures,
  'GET /v0/in_progress_forms/40-0247': mockSipGet,
  'PUT /v0/in_progress_forms/40-0247': mockSipPut,
  'POST /simple_forms_api/v1/simple_forms/submit_supporting_documents': mockUpload,
  'POST /simple_forms_api/v1/simple_forms': mockSubmission,
};

module.exports = responses;
/* eslint-enable camelcase */
