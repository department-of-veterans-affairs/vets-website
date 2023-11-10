/* eslint-disable camelcase */
const commonResponses = require('../../../../../../../platform/testing/local-dev-mock-api/common');

const mockFeatures = require('../../../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json');
const mockUpload = require('./upload.json');
const mockSubmission = require('./submission.json');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': mockFeatures,
  'POST /simple_forms_api/v1/simple_forms/submit_supporting_documents': mockUpload,
  'POST /simple_forms_api/v1/simple_forms': mockSubmission,
};

module.exports = responses;
/* eslint-enable camelcase */
