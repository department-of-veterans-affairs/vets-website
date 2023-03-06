/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const { defaultUser } = require('./user/index');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /v0/user': defaultUser,
};

module.exports = delay(responses, 2000);
