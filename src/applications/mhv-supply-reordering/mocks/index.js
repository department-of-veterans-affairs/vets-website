// eslint-disable-next-line no-unused-vars
const delay = require('mocker-api/lib/delay');

const featureToggles = require('./feature-toggles');
const inProgressFormsMdot = require('./in-progress-forms/mdot');
const maintenanceWindows = require('./maintenance-windows');
const mdotSupplies = require('./mdot/supplies');
const user = require('./user');

const mockApiResponses = {
  ...featureToggles,
  ...inProgressFormsMdot,
  ...maintenanceWindows,
  ...mdotSupplies,
  ...user,
};

// module.exports = mockApiResponses;
module.exports = delay(mockApiResponses, 1000);
