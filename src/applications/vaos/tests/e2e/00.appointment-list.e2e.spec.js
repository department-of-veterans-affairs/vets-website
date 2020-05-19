const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const VAOSHelpers = require('./vaos-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = {
  after: (client, done) => {
    client.deleteCookies();
    client.end();
    done();
  },
  login: client => {
    const token = Auth.getUserToken();

    VAOSHelpers.initAppointmentListMock(token);
    VAOSHelpers.mockGetMessageRequest(
      token,
      '8a48912a6cab0202016cb4fcaa8b0038',
    );

    Auth.logIn(
      token,
      client,
      '/health-care/schedule-view-va-appointments/appointments/',
      3,
      VAOSHelpers.getUserDataWithFacilities(),
    ).waitForElementVisible('#appointments-list', Timeouts.slow);
  },
  'Cancel appointment': client => {
    VAOSHelpers.cancelAppointmentTest(client);
  },
  'Select "show more" button': client => {
    VAOSHelpers.showMoreTest(client);
  },
};
