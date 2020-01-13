/* eslint-disable no-param-reassign */
const moment = require('moment');
const mock = require('../../../../platform/testing/e2e/mock-helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

const confirmedVA = require('../../api/confirmed_va.json');
const confirmedCC = require('../../api/confirmed_cc.json');
const requests = require('../../api/requests.json');
const cancelReasons = require('../../api/cancel_reasons.json');
const systems = require('../../api/systems.json');
const supportedSites = require('../../api/sites-supporting-var.json');
const facilities = require('../../api/facilities.json');
const facilities983 = require('../../api/facilities_983.json');

function updateConfirmedVADates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(3, 'days')
      .toISOString();

    item.attributes.startDate = futureDateStr;
    if (item.attributes.vdsAppointments[0]) {
      item.attributes.vdsAppointments[0].appointmentTime = futureDateStr;
    } else {
      item.attributes.vvsAppointments[0].dateTime = futureDateStr;
    }
  });
  return data;
}

function updateConfirmedCCDates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(4, 'days')
      .format('MM/DD/YYYY HH:mm:ss');

    item.attributes.appointmentTime = futureDateStr;
  });
  return data;
}

function updateRequestDates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(5, 'days')
      .format('MM/DD/YYYY');

    item.attributes.optionDate1 = futureDateStr;
  });
  return data;
}

function newAppointmentTest(client) {
  client
    .click('#new-appointment')
    .waitForElementVisible('.rjsf [type="submit"]', Timeouts.normal)
    .axeCheck('.main');
  return client;
}

function appointmentDateTimeTest(client, assertText) {
  client
    .click('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
    .click('.vaos-calendar__options input[id^="checkbox-0"]')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .assert.containsText('h1', assertText);

  return client;
}

function appointmentReasonTest(client, nextPageHeader) {
  client
    .selectRadio('root_reasonForAppointment', 'other')
    .waitForElementPresent(
      'textarea#root_reasonAdditionalInfo',
      Timeouts.normal,
    )
    .setValue('textarea#root_reasonAdditionalInfo', 'Additonal information')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .assert.containsText('h1', nextPageHeader);

  return client;
}

function howToBeSeenTest(client) {
  client
    .click('input#root_visitType_0')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .waitForElementVisible('h1', Timeouts.slow)
    .assert.containsText('h1', 'Your contact information');
}

function contactInformationTest(client) {
  client
    .fill('input#root_phoneNumber', '5035551234')
    .click('input#root_bestTimeToCall_morning')
    .fill('input#root_email', 'mail@gmail.com')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .assert.containsText('h1', 'Review your appointment');

  return client;
}

function reviewAppointmentTest(client) {
  client
    .axeCheck('.main')
    .click('button.usa-button.usa-button-primary')
    .waitForElementPresent('.usa-alert-success', Timeouts.normal);

  return client;
}

function appointmentSubmittedTest(client) {
  // client.click('.usa-button[href$="new-appointment/"]')
  client
    .axeCheck('.main')
    .click('.usa-button[href$="appointments/"]')
    .assert.containsText('h1', 'VA appointments');

  return client;
}

function initAppointmentListMock(token) {
  mock(token, {
    path: '/v0/feature_toggles',
    verb: 'get',
    value: {
      data: {
        features: [
          {
            name: 'vaOnlineScheduling',
            value: true,
          },
          {
            name: 'vaOnlineSchedulingCancel',
            value: true,
          },
          {
            name: 'vaOnlineSchedulingRequests',
            value: true,
          },
          {
            name: 'vaOnlineSchedulingCommunityCare',
            value: true,
          },
        ],
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/systems',
    verb: 'get',
    value: systems,
  });
  mock(token, {
    path: '/v0/vaos/community_care/supported_sites',
    verb: 'get',
    value: supportedSites,
  });
  mock(token, {
    path: '/v0/vaos/appointments',
    verb: 'get',
    query: 'type=va',
    value: updateConfirmedVADates(confirmedVA),
  });
  mock(token, {
    path: '/v0/vaos/appointments',
    verb: 'get',
    query: 'type=cc',
    value: updateConfirmedCCDates(confirmedCC),
  });
  mock(token, {
    path: '/v0/vaos/appointment_requests',
    verb: 'get',
    value: updateRequestDates(requests),
  });
  mock(token, {
    path: '/v0/vaos/appointments/cancel',
    verb: 'put',
    value: '',
  });
  mock(token, {
    path: '/v0/vaos/facilities/983/cancel_reasons',
    verb: 'get',
    value: cancelReasons,
  });
  mock(token, {
    path: '/v0/vaos/facilities',
    verb: 'get',
    value: facilities,
  });
  mock(token, {
    path: '/v0/vaos/facilities/va',
    verb: 'get',
    value: facilities,
  });
  mock(token, {
    path: '/v0/vaos/systems/983/direct_scheduling_facilities',
    verb: 'get',
    value: facilities983,
  });
  mock(token, {
    path: '/v0/vaos/facilities/983/limits',
    verb: 'get',
    value: {
      data: {
        attributes: {
          requestLimit: 1,
          numberOfRequests: 0,
        },
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/facilities/983GB/limits',
    verb: 'get',
    value: {
      data: {
        attributes: {
          requestLimit: 1,
          numberOfRequests: 0,
        },
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/appointment_requests',
    verb: 'get',
    value: facilities983,
  });
  mock(token, {
    path: '/v0/vaos/appointment_requests',
    verb: 'post',
    query: 'type=va',
    value: {
      data: {
        id: 'testing',
        attributes: {},
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/appointment_requests',
    verb: 'post',
    query: 'type=cc',
    value: {
      data: {
        id: 'testing',
        attributes: {},
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/facilities/983GB/visits/request',
    verb: 'get',
    value: {
      data: {
        id: '05084676-77a1-4754-b4e7-3638cb3124e5',
        type: 'facility_visit',
        attributes: {
          durationInMonths: 12,
          hasVisitedInPastMonths: true,
        },
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/facilities/983/visits/request',
    verb: 'get',
    value: {
      data: {
        id: '05084676-77a1-4754-b4e7-3638cb3124e5',
        type: 'facility_visit',
        attributes: {
          durationInMonths: 24,
          hasVisitedInPastMonths: true,
        },
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/community_care/eligibility/PrimaryCare',
    verb: 'get',
    value: {
      data: {
        id: 'PrimaryCare',
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    },
  });
}

module.exports = {
  initAppointmentListMock,
  newAppointmentTest,
  appointmentDateTimeTest,
  appointmentReasonTest,
  howToBeSeenTest,
  contactInformationTest,
  reviewAppointmentTest,
  appointmentSubmittedTest,
};
