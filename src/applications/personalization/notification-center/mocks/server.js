const delay = require('mocker-api/lib/delay');
const {
  generateFeatureToggles,
} = require('../../common/mocks/feature-toggles');
const user = require('../../common/mocks/users');
const notifications = require('../../common/mocks/notifications');

const responses = {
  'GET /v0/feature_toggles': generateFeatureToggles({
    myVaUseExperimental: true,
  }),
  'GET /v0/user': user.simpleUser,
  'GET /v0/onsite_notifications': notifications.hasMultiple,
};

module.exports = delay(responses, 100);
