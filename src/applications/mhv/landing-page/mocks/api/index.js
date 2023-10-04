/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
const contentBuild = require('./content-build/index');
const folders = require('./mhv-api/messaging/folders/index');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /data/cms/vamc-ehr.json': contentBuild.vamcEhr,
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
};

module.exports = delay(responses, 2000);
