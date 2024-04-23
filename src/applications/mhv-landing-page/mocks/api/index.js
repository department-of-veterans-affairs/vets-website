/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
// const user = require('../../tests/fixtures/user.json');
// const userLoa1 = require('../../tests/fixtures/user.loa1.json');
// const userWithNoFacilities = require('../../tests/fixtures/user.no-facilities.json');
const folders = require('./mhv-api/messaging/folders/index');
const vamcEhr = require('../../tests/fixtures/vamc-ehr.json');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': user,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvLandingPageEnabled: true,
    mhvLandingPagePersonalization: false,
  }),
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  'GET /data/cms/vamc-ehr.json': vamcEhr,
  'GET /v0/profile/personal_information': personalInformation,
};

module.exports = delay(responses, 1000);
