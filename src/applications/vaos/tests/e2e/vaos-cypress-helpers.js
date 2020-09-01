/* eslint-disable no-param-reassign */
import moment from '../../utils/moment-tz';

import confirmedVA from '../../mocks/var/confirmed_va.json';
import confirmedCC from '../../mocks/var/confirmed_cc.json';
import requests from '../../mocks/var/requests.json';
import cancelReasons from '../../mocks/var/cancel_reasons.json';
import supportedSites from '../../mocks/var/sites-supporting-var.json';
import facilities from '../../mocks/var/facilities.json';
import facilities983 from '../../mocks/var/facilities_983.json';
import clinicList983 from '../../mocks/var/clinicList983.json';
import {
  getVAAppointmentMock,
  getExpressCareRequestCriteriaMock,
  getParentSiteMock,
} from '../mocks/v0';

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

export function createPastVAAppointments() {
  const appointments = [];
  let appointment = getVAAppointmentMock();
  appointment.attributes = {
    ...appointment.attributes,
    startDate: moment()
      .add(-3, 'days')
      .format(),
    clinicFriendlyName: 'Three day clinic name',
    facilityId: '983',
    sta6aid: '983GC',
  };
  appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
  appointments.push(appointment);

  appointment = getVAAppointmentMock();
  appointment.attributes = {
    ...appointment.attributes,
    startDate: moment()
      .add(-4, 'months')
      .format(),
    clinicFriendlyName: 'Four month clinic name',
    facilityId: '983',
    sta6aid: '983GC',
  };
  appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
  appointments.push(appointment);

  return {
    data: appointments,
  };
}

export function initAppointmentListMock() {
  cy.server();
  cy.login();
  cy.route({
    method: 'GET',
    url: '/v0/feature_toggles*',
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
          {
            name: 'vaOnlineSchedulingExpressCare',
            value: true,
          },
          {
            name: 'vaOnlineSchedulingExpressCareNew',
            value: true,
          },
        ],
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/community_care/supported_sites',
    response: supportedSites,
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointment_requests*',
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
    url: '/vaos/v0/facilities/983/cancel_reasons',
    response: cancelReasons,
  });

  cy.route({
    method: 'PUT',
    url: '/vaos/v0/appointments/cancel',
    response: '',
  });

  cy.route({
    method: 'GET',
    url:
      '/vaos/v0/appointment_requests/8a48912a6cab0202016cb4fcaa8b0038/messages',
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
}

export function initExpressCareMocks() {
  const today = moment();
  initAppointmentListMock();

  cy.route({
    method: 'GET',
    url: '/vaos/v0/request_eligibility_criteria*',
    response: {
      data: getExpressCareRequestCriteriaMock('983', [
        {
          day: today
            .clone()
            .tz('America/Denver')
            .format('dddd')
            .toUpperCase(),
          canSchedule: true,
          startTime: today
            .clone()
            .subtract('2', 'minutes')
            .tz('America/Denver')
            .format('HH:mm'),
          endTime: today
            .clone()
            .add('2', 'minutes')
            .tz('America/Denver')
            .format('HH:mm'),
        },
      ]),
    },
  }).as('getRequestEligibilityCriteria');

  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/limits*',
    response: {
      data: {
        id: '983',
        attributes: {
          requestLimit: 1,
          numberOfRequests: 0,
        },
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities?facility_codes[]=983',
    response: {
      data: [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock().attributes,
            institutionCode: '983',
            authoritativeName: 'Some VA facility',
            rootStationCode: '983',
            parentStationCode: '983',
          },
        },
      ],
    },
  });

  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointment_requests?type=va',
    response: {
      data: {
        id: 'testing',
        attributes: {
          typeOfCareId: 'CR1',
          email: 'test@va.gov',
          phoneNumber: '5555555555',
          reasonForVisit: 'Cough',
          additionalInformation: 'Whatever',
          status: 'Submitted',
        },
      },
    },
  });
}

export function initCommunityCareMock() {
  cy.server();
  cy.login();
  cy.route({
    method: 'GET',
    url: '/v0/feature_toggles*',
    status: 200,
    response: {
      data: {
        features: [
          {
            name: 'vaOnlineScheduling',
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

  cy.route({
    method: 'GET',
    url: '/vaos/v0/community_care/supported_sites*',
    response: supportedSites,
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities**',
    response: facilities,
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/systems/983/direct_scheduling_facilities',
    response: facilities983,
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/clinics',
    response: clinicList983,
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/community_care/eligibility/PrimaryCare',
    response: {
      data: {
        id: 'PrimaryCare',
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointments?start_date=*&end_date=*&type=va',
    response: updateConfirmedVADates(confirmedVA),
  });

  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointment_requests?type=*',
    response: {
      data: {
        id: 'testing',
        attributes: {},
      },
    },
  });

  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointment_requests/testing/messages',
    response: [],
  });
}
