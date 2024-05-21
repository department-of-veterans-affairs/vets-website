/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const MOCK_TYPES = Object.freeze({
  UNVERIFIED_USER: 'unverified',
  NON_VA_PATIENT_USER: 'non_va',
  VERIFIED_USER: 'verified',
});

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const featureToggles = require('./feature-toggles/index');
const otherUsers = require('./user/index');
// const anotherVerfiedUser = require('../../tests/fixtures/user.json');
const loa1User = require('../../tests/fixtures/user.loa1.json');
const nonVaPatient = require('../../tests/fixtures/user.no-facilities.json');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = (selectedMockType = MOCK_TYPES.VERIFIED_USER) => {
  const getUser = () => {
    switch (selectedMockType) {
      case MOCK_TYPES.UNVERIFIED_USER:
        return loa1User;
      case MOCK_TYPES.NON_VA_PATIENT_USER:
        return nonVaPatient;
      default:
        return otherUsers.defaultUser;
    }
  };

  return {
    ...commonResponses,
    'GET /v0/user': getUser(),
    // Please, keep these feature toggle settings up-to-date with production's feature toggles settings.
    'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
      mhvLandingPageEnabled: true,
      mhvLandingPagePersonalization: false,
      mhvLandingPageEnableVaGovHealthToolsLinks: false,
      mhvSecondaryNavigationEnabled: false,
      mhvTransitionalMedicalRecordsLandingPage: false,
      mhvHelpdeskInformationEnabled: false,
    }),
    'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
    'GET /v0/profile/personal_information': personalInformation,
  };
};

// Change the mock type for different type of mocked content.
module.exports = delay(responses(MOCK_TYPES.VERIFIED_USER), 1000);
