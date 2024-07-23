/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const MOCK_TYPES = Object.freeze({
  UNVERIFIED_USER: 'unverified',
  UNREGISTERED_USER: 'unregistered',
  VERIFIED_NO_MHV_USER: 'verified_no_mhv',
  VERIFIED_USER: 'verified',
  VERIFIED_USER_ALL_FEATURES: 'verified_all',
});

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const { generateFeatureToggles } = require('./feature-toggles/index');
const { generateUser } = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = (selectedMockType = MOCK_TYPES.VERIFIED_USER) => {
  const getUser = () => {
    switch (selectedMockType) {
      case MOCK_TYPES.UNVERIFIED_USER:
        return generateUser({ loa: 1, vaPatient: false });
      case MOCK_TYPES.UNREGISTERED_USER:
        return generateUser({ vaPatient: false });
      case MOCK_TYPES.VERIFIED_NO_MHV_USER:
        return generateUser({ mhvAccountState: 'NONE' });
      default:
        return generateUser();
    }
  };

  const getFeatureToggles = () => {
    if (selectedMockType === MOCK_TYPES.VERIFIED_USER_ALL_FEATURES) {
      return generateFeatureToggles({ enableAll: true });
    }

    return generateFeatureToggles();
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
module.exports = delay(responses(MOCK_TYPES.VERIFIED_USER), 1000);
