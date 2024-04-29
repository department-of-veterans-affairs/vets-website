const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const travelClaims = require('./travel-claims.json');

const responses = {
  ...commonResponses,
  'GET /travel_pay/claims': travelClaims,
};

module.exports = delay(responses, 2000);
