/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles');
const user = require('./user');
const folders = require('./folders');
const recipients = require('./recipients');
const categories = require('./categories');
const messages = require('./messages');
const maintenanceWindows = require('./endpoints/maintenance-windows');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /my_health/v1/messaging/folders': folders.allFolders,
  'GET /my_health/v1/messaging/folders/:index': folders.oneFolder,
  'GET /my_health/v1/messaging/folders/:index/messages': folders.messages,
  'GET /my_health/v1/messaging/folders/0/threads': folders.allThreads,
  'GET /my_health/v1/messaging/messages/categories':
    categories.defaultCategories,
  'GET /my_health/v1/messaging/messages/:id': messages.single,
  'GET /my_health/v1/messaging/messages/:id/thread': messages.thread,
  'GET /my_health/v1/messaging/recipients': recipients.defaultRecipients,
  'GET /v0/maintenance_windows': (_req, res) => {
    // three different scenarios for testing downtime banner
    // all service names/keys are available in src/platform/monitoring/DowntimeNotification/config/externalService.js
    // but couldn't be directly imported due to export default vs module.exports

    // return res.json(
    //   maintenanceWindows.createDowntimeApproachingNotification([
    //     maintenanceWindows.SERVICES.mhvSm,
    //   ]),
    // );

    // return res.json(
    //   maintenanceWindows.createDowntimeActiveNotification([
    //     maintenanceWindows.SERVICES.mhvSm,
    //   ]),
    // );

    return res.json(maintenanceWindows.noDowntime);
  },
};

module.exports = delay(responses, 3000);
