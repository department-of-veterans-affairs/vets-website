/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const maintenanceWindows = require('./maintenance-windows');
const user = require('./user');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvLandingPageEnabled: true,
    mhvLandingPagePersonalization: true,
  }),
  ...maintenanceWindows,
};

module.exports = delay(responses, 1000);
