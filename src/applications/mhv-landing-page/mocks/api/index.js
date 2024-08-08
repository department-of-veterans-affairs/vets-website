/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const { generateFeatureToggles } = require('./feature-toggles/index');
const { generateUser } = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const USER_MOCKS = Object.freeze({
  UNVERIFIED: generateUser({ loa: 1, vaPatient: false }),
  UNREGISTERED: generateUser({ vaPatient: false }),
  NO_MHV_ACCOUNT: generateUser({ mhvAccountState: 'NONE' }),
  MHV_BASIC_ACCOUNT: generateUser({ loa: 1, serviceName: 'mhv' }),
  DEFAULT: generateUser(),
});

const responses = (userMock = USER_MOCKS.DEFAULT) => {
  return {
    ...commonResponses,
    'GET /v0/user': userMock,
    'GET /v0/feature_toggles': generateFeatureToggles(),
    // 'GET /v0/feature_toggles': generateFeatureToggles({ enableAll: true }),
    'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
    'GET /v0/profile/personal_information': personalInformation,
  };
};

// Change the mock type for different type of mocked content.
// Please keep this mock set to USER_MOCKS.DEFAULT to keep features like in production.
module.exports = delay(responses(USER_MOCKS.DEFAULT), 250);
