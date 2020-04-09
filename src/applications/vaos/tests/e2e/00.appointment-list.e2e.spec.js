const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const VAOSHelpers = require('./vaos-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  VAOSHelpers.initAppointmentListMock(token);
  E2eHelpers.overrideVetsGovApi(client);

  // init announcements
  client.execute(() => {
    // window.localStorage.clear();
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      '["welcome-to-new-vaos"]',
    );
  });

  Auth.logIn(
    token,
    client,
    '/health-care/schedule-view-va-appointments/appointments/',
    3,
    VAOSHelpers.getUserDataWithFacilities(),
  )
    .waitForElementVisible('#appointments-list', Timeouts.slow)
    .axeCheck('.main');

  client
    .click('.vaos-appts__cancel-btn')
    .waitForElementVisible('#cancelAppt', Timeouts.slow)
    .axeCheck('.main')
    .click('#cancelAppt .usa-button')
    .waitForElementVisible('.usa-alert-success', Timeouts.normal)
    .axeCheck('.main')
    .click('#cancelAppt button')
    .waitForElementNotPresent('#cancelAppt', Timeouts.normal);

  client.end();
});
