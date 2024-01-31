/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const maintenanceWindows = require('./maintenance-windows');
const user = require('./user');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('./personal-information.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvLandingPageEnabled: true,
    mhvLandingPagePersonalization: true,
  }),
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  'GET /v0/profile/personal_information': personalInformation,
  ...maintenanceWindows,
};

module.exports = delay(responses, 1000);
