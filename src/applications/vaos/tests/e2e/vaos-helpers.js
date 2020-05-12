/* eslint-disable no-param-reassign */
const moment = require('moment');
const mock = require('../../../../platform/testing/e2e/mock-helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const Auth = require('../../../../platform/testing/e2e/auth');

const confirmedVA = require('../../api/confirmed_va.json');
const confirmedCC = require('../../api/confirmed_cc.json');
const requests = require('../../api/requests.json');
const cancelReasons = require('../../api/cancel_reasons.json');
const supportedSites = require('../../api/sites-supporting-var.json');
const facilities = require('../../api/facilities.json');
const facilities983 = require('../../api/facilities_983.json');
const clinicList983 = require('../../api/clinicList983.json');
const slots = require('../../api/slots.json');
const pact = require('../../api/pact.json');

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

function updateTimeslots(data) {
  const startDateTime = moment()
    .add(4, 'days')
    .day(9)
    .format('YYYY-MM-DDTHH:mm:ss[+0:00]');
  const endDateTime = moment()
    .add(4, 'days')
    .day(9)
    .add(60, 'minutes')
    .format('YYYY-MM-DDTHH:mm:ss[+0:00]');

  const newSlot = {
    bookingStatus: '1',
    remainingAllowedOverBookings: '3',
    availability: true,
    startDateTime,
    endDateTime,
  };

  data.data[0].attributes.appointmentTimeSlot = [newSlot];

  return data;
}
function newAppointmentTest(client, nextElement = '.rjsf [type="submit"]') {
  client
    .click('#new-appointment')
    .waitForElementVisible(nextElement, Timeouts.normal);

  return client;
}

function appointmentDateTimeTest(client, nextElement) {
  client
    .click('.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])')
    .click(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    )
    .axeCheck('.main')
    .click('.form-progress-buttons [type="submit"]')
    .waitForElementPresent(nextElement, Timeouts.slow);

  return client;
}

function appointmentReasonTest(client, nextElement) {
  client
    .selectRadio('root_reasonForAppointment', 'other')
    .waitForElementPresent(
      'textarea#root_reasonAdditionalInfo',
      Timeouts.normal,
    )
    .setValue('textarea#root_reasonAdditionalInfo', 'Additonal information')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .waitForElementPresent(nextElement, Timeouts.normal);

  return client;
}

function howToBeSeenTest(client, nextElement) {
  client
    .click('input#root_visitType_0')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .waitForElementPresent(nextElement, Timeouts.normal);
}

function contactInformationTest(client, nextElement) {
  client
    .fill('input#root_phoneNumber', '5035551234')
    .click('input#root_bestTimeToCall_morning')
    .fill('input#root_email', 'mail@gmail.com')
    .axeCheck('.main')
    .click('.rjsf [type="submit"]')
    .waitForElementPresent(nextElement, Timeouts.normal);

  return client;
}

function reviewAppointmentTest(client, nextElement = '.usa-alert-success') {
  client
    .axeCheck('.main')
    .click('button.usa-button.usa-button-primary')
    .waitForElementPresent(nextElement, Timeouts.normal);

  return client;
}

function appointmentSubmittedTest(client) {
  client
    .axeCheck('.main')
    .click('.usa-button[href$="appointments/"]')
    .assert.containsText('h1', 'VA appointments');

  return client;
}

function mockSingleSystem(token, id) {
  mock(token, {
    path: '/vaos/v0/facilities',
    verb: 'get',
    value: {
      data: facilities.data.filter(f => f.id === id),
    },
  });
}

function mockSingleFacility(token, systemId, facilityId) {
  mock(token, {
    path: `/vaos/v0/systems/${systemId}/direct_scheduling_facilities`,
    verb: 'get',
    value: {
      data: facilities983.data.filter(f => f.id === facilityId),
    },
  });
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
          {
            name: 'vaOnlineSchedulingDirect',
            value: true,
          },
          {
            name: 'vaOnlineSchedulingPast',
            value: true,
          },
        ],
      },
    },
  });
  mock(token, {
    path: '/vaos/v0/community_care/supported_sites',
    verb: 'get',
    value: supportedSites,
  });
  mock(token, {
    path: '/vaos/v0/appointments',
    verb: 'get',
    query: 'type=va',
    value: updateConfirmedVADates(confirmedVA),
  });
  mock(token, {
    path: '/vaos/v0/appointments',
    verb: 'get',
    query: 'type=cc',
    value: updateConfirmedCCDates(confirmedCC),
  });
  mock(token, {
    path: '/vaos/v0/appointment_requests',
    verb: 'get',
    value: updateRequestDates(requests),
  });
  mock(token, {
    path: '/vaos/v0/appointments/cancel',
    verb: 'put',
    value: '',
  });
  mock(token, {
    path: '/vaos/v0/facilities/983/cancel_reasons',
    verb: 'get',
    value: cancelReasons,
  });
  mock(token, {
    path: '/vaos/v0/facilities',
    verb: 'get',
    value: facilities,
  });
  mock(token, {
    path: '/vaos/v0/systems/983/direct_scheduling_facilities',
    verb: 'get',
    value: facilities983,
  });
  mock(token, {
    path: '/vaos/v0/facilities/983/clinics',
    verb: 'get',
    value: clinicList983,
  });
  mock(token, {
    path: '/vaos/v0/systems/983/pact',
    verb: 'get',
    value: pact,
  });
  mock(token, {
    path: '/vaos/v0/facilities/983GB/clinics',
    verb: 'get',
    value: {
      data: [],
    },
  });
  mock(token, {
    path: '/vaos/v0/facilities/983/available_appointments',
    verb: 'get',
    value: updateTimeslots(slots),
  });
  mock(token, {
    path: '/vaos/v0/facilities/983/limits',
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
    path: '/vaos/v0/facilities/983GB/limits',
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
    path: '/vaos/v0/appointment_requests',
    verb: 'get',
    value: facilities983,
  });
  mock(token, {
    path: '/vaos/v0/appointment_requests',
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
    path: '/vaos/v0/appointment_requests',
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
    path: '/vaos/v0/appointments',
    verb: 'post',
    value: {
      data: {},
    },
  });
  mock(token, {
    path: '/vaos/v0/facilities/983GB/visits/request',
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
    path: '/vaos/v0/facilities/983/visits/request',
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
    path: '/vaos/v0/facilities/983/visits/direct',
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
    path: '/vaos/v0/facilities/983GB/visits/direct',
    verb: 'get',
    value: {
      data: {
        id: '05084676-77a1-4754-b4e7-3638cb3124e5',
        type: 'facility_visit',
        attributes: {
          durationInMonths: 24,
          hasVisitedInPastMonths: false,
        },
      },
    },
  });
  mock(token, {
    path: '/vaos/v0/community_care/eligibility/PrimaryCare',
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

function getUserDataWithFacilities() {
  const response = Auth.getDefaultUserResponse(3);

  /* eslint-disable camelcase */
  response.data.attributes.va_profile.facilities = [
    {
      facility_id: '983',
      isCerner: false,
    },
    {
      facility_id: '984',
      isCerner: false,
    },
  ];
  /* eslint-enable camelcase */

  return response;
}

function getUserDataWithSingleSystem(id) {
  const response = Auth.getDefaultUserResponse(3);

  /* eslint-disable camelcase */
  response.data.attributes.va_profile.facilities = [
    {
      facility_id: id,
      isCerner: false,
    },
  ];
  /* eslint-enable camelcase */

  return response;
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
  getUserDataWithFacilities,
  getUserDataWithSingleSystem,
  mockSingleFacility,
  mockSingleSystem,
};
