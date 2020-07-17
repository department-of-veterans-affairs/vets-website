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
    // .axeCheck('.main');
  },
  'Select new appointment': client => {
    VAOSHelpers.newAppointmentTest(client);
  },
  'Choose the type of care you need': client => {
    client
      .click('[value="323"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('[value="communityCare"]', Timeouts.slow);
  },
  'Choose where you want to receive your care': client => {
    client
      .click('[value="communityCare"]')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('.vaos-calendar__calendars', Timeouts.slow);
  },
  'What date and time would you like to make an appointment?': client => {
    VAOSHelpers.appointmentDateTimeTest(
      client,
      '#root_communityCareSystemId_0',
    );
  },
  'Share your community care provider preferences': client => {
    client
      .selectRadio('root_communityCareSystemId', 'var983')
      .selectDropdown('root_preferredLanguage', 'english')
      .selectYesNo('root_hasCommunityCareProvider', true)
      .waitForElementPresent(
        '#root_communityCareProvider_practiceName',
        Timeouts.slow,
      )
      .setValue('#root_communityCareProvider_practiceName', 'practice name')
      .setValue('#root_communityCareProvider_firstName', 'firstname')
      .setValue('#root_communityCareProvider_lastName', 'lastname')
      .setValue('#root_communityCareProvider_address_street', 'address1')
      .setValue('#root_communityCareProvider_address_street2', 'address2')
      .setValue('#root_communityCareProvider_address_city', 'city')
      .selectDropdown('root_communityCareProvider_address_state', 'IL')
      .setValue('#root_communityCareProvider_address_postalCode', '60613')
      .setValue('#root_communityCareProvider_phone', '1234567890')
      .axeCheck('.main')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('#root_reasonForAppointment_0', Timeouts.slow);
  },
  'Reason for appointment': client => {
    VAOSHelpers.appointmentReasonTest(client, '#root_phoneNumber');
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
