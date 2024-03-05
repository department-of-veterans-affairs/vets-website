/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

// const commonResponses = require('../../../testing/local-dev-mock-api/common');
const medicalRecordResponses = require('./medical-records');
const secureMessagesResponses = require('./secure-messages');

const featureToggles = require('./shared/feature-toggles');
const user = require('./shared/user');
const maintenanceWindows = require('./shared/maintenance-windows');

const responses = {
  // ...commonResponses,
  ...medicalRecordResponses,
  ...secureMessagesResponses,

  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),

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
