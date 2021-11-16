/* eslint-disable camelcase */

const commonResponses = require('../../../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('../mocks/feature.toggles');
const delay = require('mocker-api/lib/delay');

const responses = {
  ...commonResponses,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles(),
};

module.exports = delay(responses, 2000);
