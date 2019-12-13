const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const VAOSHelpers = require('./vaos-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

const continueButton = '.rjsf [type="submit"]';

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
    // .axeCheck('.main');
  },
  'Select new appointment': client => {
    client
      .click('#new-appointment')
      .waitForElementVisible(continueButton, Timeouts.normal)
      .axeCheck('.main');
  },
  'Choose the type of care you need': client => {
    client.click('[value="SLEEP"]').perform(() => {
      client
        .click('.rjsf [type="submit"]')
        .waitForElementPresent('h1', Timeouts.slow)
        .assert.containsText('h1', 'Choose the type of sleep care you need');
    });
  },
  'Choose the type of sleep care you need': client => {
    client.click('[value="349"]').perform(() => {
      client
        .click('.rjsf [type="submit"]')
        .assert.containsText('h1', 'Choose a VA location for your appointment');
    });
  },
  'Choose a VA location for your appointment': client => {
    client.click('[value="983"]').perform(() => {
      client
        .waitForElementPresent(
          '[name = "root_vaFacility"][value = "983GB"]',
          Timeouts.normal,
        )
        .click('[name = "root_vaFacility"][value = "983GB"]')
        .pause(Timeouts.normal)
        .click('.rjsf [type="submit"]')
        .waitForElementPresent('h1', Timeouts.normal)
        .assert.containsText(
          'h1',
          'What date and time would you like to make an appointment?',
        );
    });
  },
  'What date and time would you like to make an appointment?': client => {
    client
      .click(
        '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])',
      )
      .perform(() => {
        client
          .click('.vaos-calendar__options input[id^="checkbox-0"]')
          .click('.rjsf [type="submit"]')
          .assert.containsText('h1', 'Reason for appointment');
      });
  },
  'Reason for appointment': client => {
    client.click('#root_reasonForAppointment_0').perform(() => {
      client
        .setValue('textarea#root_reasonAdditionalInfo', 'Additonal information')
        .click('.rjsf [type="submit"]')
        .assert.containsText('h1', 'How would you like to be seen?');
    });
  },
  'How would you like to be seen?': client => {
    client.click('input#root_visitType_0').perform(() => {
      client
        .click('.rjsf [type="submit"]')
        .assert.containsText('h1', 'Contact information');
    });
  },
  'Contact information': client => {
    client
      .getValue('input#root_phoneNumber', result => {
        if (!result.value) {
          client.setValue('input#root_phoneNumber', '5035551234');
        }
      })
      .click('input#root_bestTimeToCall_morning')
      .getValue('input#root_email', result => {
        if (!result.value) {
          client.setValue('input#root_email', 'mail@gmail.com');
        }
      })
      .click('.rjsf [type="submit"]')
      .assert.containsText('h1', 'Review your appointment details');
  },
  'Review your appointment details': client => {
    client.click('button.usa-button.usa-button-primary').perform(() => {
      client.assert.containsText(
        'h1',
        'Your appointment request has been submitted',
      );
    });
  },
  'Your appointment request has been submitted': client => {
    // client.click('.usa-button[href$="new-appointment/"]')
    client.click('.usa-button[href$="appointments/"]').perform(() => {
      client.assert.containsText('h1', 'VA appointments');
    });
  },
};
