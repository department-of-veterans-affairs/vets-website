/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
const mdot = require('./mdot/index');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /v0/in_progress_forms/mdot': mdot.suppliesResponse,
  'POST /v0/mdot/supplies': [
    { status: 'Order Processed', orderId: 10661, productId: 6650 },
  ],
};

module.exports = delay(responses, 2000);
