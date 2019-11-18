const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const VAOSHelpers = require('./vaos-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');
const FormsTestHelpers = require('platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  VAOSHelpers.initAppointmentListMock(token);
  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);

  // Claim is visible
  Auth.logIn(
    token,
    client,
    '/health-care/schedule-view-va-appointments/appointments/',
    3,
  )
    .pause(30000)
    .waitForElementVisible('#appointments-list', Timeouts.slow)
    .axeCheck('.main');

  client.end();
});
