const delay = require('mocker-api/lib/delay');

const maintenanceWindows = require('./endpoints/maintenance-windows');

// Helper functions to switch maintenance window scenarios for testing
// eslint-disable-next-line no-unused-vars
const setActiveDowntime = (
  res,
  services = [maintenanceWindows.SERVICES.global],
) => {
  return res.json(
    maintenanceWindows.createDowntimeActiveNotification(services),
  );
};

// eslint-disable-next-line no-unused-vars
const setApproachingDowntime = (
  res,
  services = [maintenanceWindows.SERVICES.global],
) => {
  return res.json(
    maintenanceWindows.createDowntimeApproachingNotification(services),
  );
};

// eslint-disable-next-line no-unused-vars
const setFutureDowntime = (
  res,
  services = [maintenanceWindows.SERVICES.global],
) => {
  return res.json(
    maintenanceWindows.createDowntimeFutureNotification(services),
  );
};

const setNoDowntime = res => {
  return res.json(maintenanceWindows.noDowntime);
};

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': (_req, res) => {
    // uncomment based on what's needed for testing
    // return setActiveDowntime(res);
    // return setApproachingDowntime(res);
    // return setFutureDowntime(res);
    return setNoDowntime(res);
  },
};

// here we can run anything that needs to happen before the mock server starts up
// this runs every time a file is mocked
const generateMockResponses = () => {
  // set DELAY=1000 when running mock server script
  // to add 1 sec delay to all responses
  const responseDelay = process?.env?.DELAY || 0;

  return responseDelay > 0 ? delay(responses, responseDelay) : responses;
};

module.exports = generateMockResponses();
