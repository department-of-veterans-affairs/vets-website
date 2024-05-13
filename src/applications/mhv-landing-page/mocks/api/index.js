/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
// const user = require('../../tests/fixtures/user.json');
// const loa1User = require('../../tests/fixtures/user.loa1.json');
// const nonVaPatient = require('../../tests/fixtures/user.no-facilities.json');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  // Please, keep these feature toggle settings up-to-date with production's feature toggles settings.
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvLandingPageEnabled: true,
    mhvLandingPagePersonalization: false,
    mhvLandingPageEnableVaGovHealthToolsLinks: false,
    mhvSecondaryNavigationEnabled: false,
    mhvTransitionalMedicalRecordsLandingPage: false,
  }),
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  'GET /v0/profile/personal_information': personalInformation,
};

module.exports = delay(responses, 1000);
