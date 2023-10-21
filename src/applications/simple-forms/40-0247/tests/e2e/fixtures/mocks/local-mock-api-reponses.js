/* eslint-disable camelcase */
const commonResponses = require('../../../../../../../platform/testing/local-dev-mock-api/common');

const mockUpload = require('./upload.json');
const mockSubmission = require('./submission.json');

const responses = {
  ...commonResponses,
  'POST /v0/simple-forms/40-0247/files': mockUpload,
  'POST /simple_forms_api/v1/simple_forms': mockSubmission,
};

module.exports = responses;
/* eslint-enable camelcase */
