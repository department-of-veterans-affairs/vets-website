const delay = require('mocker-api/lib/delay');
const { generateFeatureToggles } = require('./feature-toggles');
const user = require('./users');
const notifications = require('./notifications');

/* eslint-disable camelcase */
const responses = {
  'GET /v0/feature_toggles': generateFeatureToggles({
    myVaUseExperimental: true,
  }),
  'GET /v0/user': user.simpleUser,
  'GET /v0/onsite_notifications': notifications.hasMultiple,
};

module.exports = delay(responses, 100);
