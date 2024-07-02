/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const MOCK_TYPES = Object.freeze({
  UNVERIFIED_USER: 'unverified',
  UNREGISTERED_USER: 'unregistered',
  VERIFIED_USER: 'verified',
  VERIFIED_NO_MHV_USER: 'verified_no_mhv',
  VERIFIED_USER_ALL_FEATURES: 'verified_all',
});

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const { generateFeatureToggles } = require('./feature-toggles/index');
const { generateUser } = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  // Please, keep these feature toggle settings up-to-date with production's feature toggles settings.
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvLandingPagePersonalization: false,
    mhvLandingPageEnableVaGovHealthToolsLinks: false,
    mhvSecondaryNavigationEnabled: true,
  }),
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  'GET /v0/profile/personal_information': personalInformation,
};

// Change the mock type for different type of mocked content.
// Please keep this mock to always return MOCK_TYPES.VERIFIED_USER to keep features like in production.
module.exports = delay(responses(MOCK_TYPES.VERIFIED_USER), 1000);
