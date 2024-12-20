const { generateFeatureToggles } = require('./feature-toggles/index');
const { USER_MOCKS } = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');
const MHVAccountStatus = require('./user/mhvAccountStatus');

const responses = (userMock = USER_MOCKS.DEFAULT) => ({
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/user': userMock,
  '/v0/feature_toggles(.*)': generateFeatureToggles(),
  // '/v0/feature_toggles(.*)': generateFeatureToggles({ enableAll: true }),
  '/my_health/v1/messaging/folders(.*)': folders.allFoldersWithUnreadMessages,
  'GET /v0/profile/personal_information': personalInformation,
  '/data/cms/vamc-ehr.json': '',

  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.accountSuccess,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.eightZeroOne,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.eightZeroFive,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.fiveZeroZero,
  'GET /v0/user/mhv_user_account': MHVAccountStatus.multiError,
});

module.exports = responses(USER_MOCKS.DEFAULT);
