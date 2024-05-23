/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const MOCK_TYPES = Object.freeze({
  UNVERIFIED_USER: 'unverified',
  UNREGISTERED_USER: 'unregistered',
  VERIFIED_USER: 'verified',
  VERIFIED_USER_ALL_FEATURES: 'verified_all',
});

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const featureToggles = require('./feature-toggles/index');
const otherUsers = require('./user/index');
// const anotherVerfiedUser = require('../../tests/fixtures/user.json');
const loa1User = require('../../tests/fixtures/user.loa1.json');
const unregisteredUser = require('../../tests/fixtures/user.unregistered.json');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = (selectedMockType = MOCK_TYPES.VERIFIED_USER) => {
  const getUser = () => {
    switch (selectedMockType) {
      case MOCK_TYPES.UNVERIFIED_USER:
        return loa1User;
      case MOCK_TYPES.UNREGISTERED_USER:
        return unregisteredUser;
      default:
        return otherUsers.defaultUser;
    }
  };

  const getFeatureToggles = () => {
    if (selectedMockType === MOCK_TYPES.VERIFIED_USER_ALL_FEATURES) {
      return featureToggles.generateFeatureToggles({ enableAll: true });
    }

    return featureToggles.generateFeatureToggles();
  };

  return {
    ...commonResponses,
    'GET /v0/user': getUser(),
    'GET /v0/feature_toggles': getFeatureToggles(),
    'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
    'GET /v0/profile/personal_information': personalInformation,
  };
};

// Change the mock type for different type of mocked content.
// Please keep this mock to always return MOCK_TYPES.VERIFIED_USER to keep features like in production.
module.exports = delay(responses(MOCK_TYPES.NON_VA_PATIENT_USER), 1000);
