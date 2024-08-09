// const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const { generateFeatureToggles } = require('./feature-toggles/index');
const { USER_MOCKS } = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');

const responses = (userMock = USER_MOCKS.DEFAULT) => ({
  ...commonResponses,
  'GET /v0/user': userMock,
  '/v0/feature_toggles(.*)': generateFeatureToggles(),
  // '/v0/feature_toggles': generateFeatureToggles({ enableAll: true }),
  '/my_health/v1/messaging/folders(.*)': folders.allFoldersWithUnreadMessages,
  'GET /v0/profile/personal_information': personalInformation,
  '/data/cms/vamc-ehr.json': '',
});

// Change the mock type for different type of mocked content.
// Please keep this mock set to USER_MOCKS.DEFAULT to keep features like in production.
module.exports = responses(USER_MOCKS.DEFAULT);
