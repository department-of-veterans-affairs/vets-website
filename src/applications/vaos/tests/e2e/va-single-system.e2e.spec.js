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
    VAOSHelpers.mockSingleSystem(token, '983');

    Auth.logIn(
      token,
      client,
      '/health-care/schedule-view-va-appointments/appointments/',
      3,
      VAOSHelpers.getUserDataWithSingleSystem('983'),
    ).waitForElementVisible('#appointments-list', Timeouts.slow);
  },
  'Select new appointment': client => {
    VAOSHelpers.newAppointmentTest(client);
  },
  'Choose the type of care you need': client => {
    client
      .click('[value="323"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('#root_facilityType_0', Timeouts.slow);
  },
  'Choose where you want to receive your care': client => {
    client
      .click('[value="vamc"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('#root_vaFacility_0', Timeouts.slow);
  },
  'Choose VA facility': client => {
    client
      .click('[name = "root_vaFacility"][value = "var983GB"]')
      .pause(Timeouts.normal)
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('.vaos-calendar__calendars', Timeouts.slow);
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
