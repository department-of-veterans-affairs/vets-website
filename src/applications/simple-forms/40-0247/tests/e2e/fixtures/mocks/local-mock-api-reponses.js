/* eslint-disable camelcase */
const commonResponses = require('../../../../../../../platform/testing/local-dev-mock-api/common');

const mockUpload = require('../../../../../shared/tests/e2e/fixtures/mocks/mock-upload.json');

const responses = {
  ...commonResponses,
  'POST /v0/simple-forms/40-0247/files': mockUpload,
};

module.exports = responses;
/* eslint-enable camelcase */
