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

    Auth.logIn(
      token,
      client,
      '/health-care/schedule-view-va-appointments/appointments/',
      3,
    ).waitForElementVisible('#appointments-list', Timeouts.slow);
  },
  'Select new appointment': client => {
    VAOSHelpers.newAppointmentTest(client);
  },
  'Choose the type of care you need': client => {
    client
      .click('[value="211"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('h1', Timeouts.normal)
      .assert.containsText('h1', 'Choose a VA location for your appointment');
  },
  'Choose a VA location for your appointment': client => {
    client
      .click('[value="983"]')
      .waitForElementPresent(
        '[name = "root_vaFacility"][value = "983"]',
        Timeouts.slow,
      )
      .click('[name = "root_vaFacility"][value = "983"]')
      .pause(Timeouts.normal)
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('h1', Timeouts.normal)
      .assert.containsText('h1', 'Choose a day and time for your appointment');
  },
  'What date and time would you like to make an appointment?': client => {
    VAOSHelpers.appointmentDateTimeTest(
      client,
      'Choose a reason for your appointment',
    );
  },
  'Reason for appointment': client => {
    VAOSHelpers.appointmentReasonTest(client, 'Choose a type of appointment');
  },
  'How would you like to be seen?': client => {
    VAOSHelpers.howToBeSeenTest(client);
  },
  'Contact information': client => {
    VAOSHelpers.contactInformationTest(client);
  },
  'Review your appointment details': client => {
    VAOSHelpers.reviewAppointmentTest(client);
  },
  'Your appointment request has been submitted': client => {
    VAOSHelpers.appointmentSubmittedTest(client);
  },
};
