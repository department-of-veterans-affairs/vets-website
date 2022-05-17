const delay = require('mocker-api/lib/delay');
const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');
const mockStatements = require('./combinedStatements');

/* eslint-disable camelcase */
const responses = {
  ...commonResponses,
  'GET v0/medical_copays': mockStatements,
};

module.exports = delay(responses, 2000);
