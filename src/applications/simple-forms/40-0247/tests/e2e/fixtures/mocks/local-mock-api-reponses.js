/* eslint-disable camelcase */
const commonResponses = require('../../../../../../../platform/testing/local-dev-mock-api/common');

const mockUpload = require('./upload.json');

const responses = {
  ...commonResponses,
  'POST /simple_forms_api/v1/simple_forms/submit_supporting_documents': mockUpload,
};

module.exports = responses;
/* eslint-enable camelcase */
