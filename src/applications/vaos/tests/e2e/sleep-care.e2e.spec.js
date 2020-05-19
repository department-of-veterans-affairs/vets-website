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
      VAOSHelpers.getUserDataWithFacilities(),
    ).waitForElementVisible('#appointments-list', Timeouts.slow);
  },
  'Select new appointment': client => {
    VAOSHelpers.newAppointmentTest(client);
  },
  'Choose the type of care you need': client => {
    client
      .click('[value="SLEEP"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('#root_typeOfSleepCareId_0', Timeouts.normal);
  },
  'Choose the type of sleep care you need': client => {
    client
      .click('[value="349"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('#root_vaParent_0', Timeouts.normal);
  },
  'Choose a VA location for your appointment': client => {
    client
      .click('[value="var983"]')
      .waitForElementPresent(
        '[name = "root_vaFacility"][value = "var983GB"]',
        Timeouts.slow,
      )
      .click('[name = "root_vaFacility"][value = "var983GB"]')
      .pause(Timeouts.normal)
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('.vaos-calendar__calendars', Timeouts.normal);
  },
  'What date and time would you like to make an appointment?': client => {
    VAOSHelpers.appointmentDateTimeTest(client, '#root_reasonForAppointment_0');
  },
  'Reason for appointment': client => {
    VAOSHelpers.appointmentReasonTest(client, '#root_visitType_0');
  },
  'How would you like to be seen?': client => {
    VAOSHelpers.howToBeSeenTest(client, '#root_phoneNumber');
  },
  'Contact information': client => {
    VAOSHelpers.contactInformationTest(client, '.vaos-review__header');
  },
  'Review your appointment details': client => {
    VAOSHelpers.reviewAppointmentTest(client);
  },
  'Your appointment request has been submitted': client => {
    VAOSHelpers.appointmentSubmittedTest(client);
  },
};
