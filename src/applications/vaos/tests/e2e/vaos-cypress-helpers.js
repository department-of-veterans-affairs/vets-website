/* eslint-disable no-param-reassign */
import moment from 'moment';

import pact from '../../api/pact.json';
import confirmedVA from '../../api/confirmed_va.json';
import confirmedCC from '../../api/confirmed_cc.json';
import requests from '../../api/requests.json';
import cancelReasons from '../../api/cancel_reasons.json';
import supportedSites from '../../api/sites-supporting-var.json';
import facilities from '../../api/facilities.json';
import facilities983 from '../../api/facilities_983.json';
import clinicList983 from '../../api/clinicList983.json';
import slots from '../../api/slots.json';

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
    .format('YYYY-MM-DDTHH:mm:ss[+00:00]');
  const endDateTime = moment()
    .add(4, 'days')
    .day(9)
    .add(60, 'minutes')
    .format('YYYY-MM-DDTHH:mm:ss[+00:00]');

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

export function initAppointmentListMock() {
  cy.server();
  cy.login();
  cy.route({
    method: 'GET',
    url: '**/v0/feature_toggles*',
    status: 200,
    response: {
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

  cy.route({
    method: 'GET',
    url: '**/vaos/v0/community_care/supported_sites',
    response: supportedSites,
  });

  cy.route({
    method: 'GET',
    url: '**/vaos/v0/appointment_requests**',
    response: updateRequestDates(requests),
  });

  cy.route({
    method: 'GET',
    url: /.*\/v0\/appointments.*type=va$/,
    response: updateConfirmedVADates(confirmedVA),
  });

  cy.route({
    method: 'GET',
    url: /.*\/v0\/appointments.*type=cc$/,
    response: updateConfirmedCCDates(confirmedCC),
  });

  cy.route({
    method: 'GET',
    url: '**/vaos/v0/facilities/983/cancel_reasons',
    response: cancelReasons,
  });

  cy.route({
    method: 'PUT',
    url: '**/vaos/v0/appointments/cancel',
    response: '',
  });

  cy.route({
    method: 'GET',
    url:
      '**/vaos/v0/appointment_requests/8a48912a6cab0202016cb4fcaa8b0038/messages',
    response: {
      data: [
        {
          id: '8a48912a6cab0202016cb4fcaa8b0038',
          type: 'messages',
          attributes: {
            surrogateIdentifier: {},
            messageText: 'Request 2 Message 1 Text',
            messageDateTime: '11/11/2019 12:26:13',
            senderId: '1012845331V153043',
            appointmentRequestId: '8a48912a6cab0202016cb4fcaa8b0038',
            date: '2019-11-11T12:26:13.931+0000',
            assigningAuthority: 'ICN',
            systemId: 'var',
          },
        },
      ],
    },
  });

  cy.visit('health-care/schedule-view-va-appointments/appointments/');
  cy.get('.va-modal-body button').click();
}
