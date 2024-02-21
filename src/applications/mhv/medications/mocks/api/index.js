/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const vamcEhr = require('./vamc-ehr.json');
const personalInformation = require('./user/personal-information.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvLandingPageEnabled: true,
    mhvLandingPagePersonalization: true,
  }),
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  'GET /data/cms/vamc-ehr.json': vamcEhr,
  'GET /v0/profile/personal_information': personalInformation,
};

module.exports = delay(responses, 1000);
