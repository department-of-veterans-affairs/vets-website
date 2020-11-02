/* eslint-disable no-param-reassign */
import moment from '../../lib/moment-tz';

import confirmedVA from '../../services/mocks/var/confirmed_va.json';
import confirmedCC from '../../services/mocks/var/confirmed_cc.json';
import requests from '../../services/mocks/var/requests.json';
import cancelReasons from '../../services/mocks/var/cancel_reasons.json';
import supportedSites from '../../services/mocks/var/sites-supporting-var.json';
import facilities from '../../services/mocks/var/facilities.json';
import facilities983 from '../../services/mocks/var/facilities_983.json';
import clinicList983 from '../../services/mocks/var/clinicList983.json';
import slots from '../../services/mocks/var/slots.json';
import requestEligibilityCriteria from '../../services/mocks/var/request_eligibility_criteria.json';
import directEligibilityCriteria from '../../services/mocks/var/direct_booking_eligibility_criteria.json';
import facilityDetails from '../../services/mocks/var/facility_data.json';

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

function mockFeatureToggles({ facilityPageV2Enabled = false } = {}) {
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
          {
            name: 'vaOnlineSchedulingFlatFacilityPage',
            value: !!facilityPageV2Enabled,
          },
        ],
      },
    },
  });
}

function mockRequestLimits(id = '983') {
  cy.route({
    method: 'GET',
    url: `/vaos/v0/facilities/${id}/limits*`,
    response: {
      data: {
        id,
        attributes: {
          requestLimit: 1,
          numberOfRequests: 0,
        },
      },
    },
  });
}

function mockSupportedSites() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/community_care/supported_sites*',
    response: supportedSites,
  });
}

function mockCCPrimaryCareEligibility() {
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
}

function mockRequestEligibilityCriteria() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/request_eligibility_criteria*',
    response: requestEligibilityCriteria,
  });
}

function mockDirectBookingEligibilityCriteria() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/direct_booking_eligibility_criteria*',
    response: directEligibilityCriteria,
  });
}

function mockFacilityDetails() {
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va?ids=*',
    response: facilityDetails,
  });
}

function mockFacilities() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities**',
    response: facilities,
  });
}

function mockDirectSchedulingFacilities() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/systems/983/direct_scheduling_facilities*',
    response: facilities983,
  });
}

function mockPrimaryCareClinics() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/clinics*',
    response: clinicList983,
  });
}

function mockSubmitVAAppointment() {
  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointments',
    response: { data: {} },
  }).as('appointmentSubmission');
}

function setupSchedulingMocks({ facilityPageV2Enabled = false } = {}) {
  cy.server();
  cy.login();
  mockFeatureToggles({ facilityPageV2Enabled });
  mockSupportedSites();
  mockCCPrimaryCareEligibility();
  mockRequestEligibilityCriteria();
  mockDirectBookingEligibilityCriteria();
  mockFacilityDetails();
  mockFacilities();
  mockDirectSchedulingFacilities();
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

function mockVisits(id = '983') {
  cy.route({
    method: 'GET',
    url: `/vaos/v0/facilities/${id}/visits/*`,
    response: {
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
}

function mockDirectScheduleSlots() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/available_appointments*',
    response: updateTimeslots(slots),
  });
}

export function initAppointmentListMock() {
  cy.server();
  cy.login();
  mockFeatureToggles();
  mockSupportedSites();

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
      data: [
        getExpressCareRequestCriteriaMock('983', [
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
      ],
    },
  }).as('getRequestEligibilityCriteria');

  mockRequestLimits();

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

export function initVAAppointmentMock({ facilityPageV2Enabled = false } = {}) {
  setupSchedulingMocks({ facilityPageV2Enabled });
  mockPrimaryCareClinics();
  mockRequestLimits();
  mockVisits();
  mockDirectScheduleSlots();
  mockSubmitVAAppointment();
}

export function initVARequestMock() {
  setupSchedulingMocks();
  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/clinics*',
    response: { data: [] },
  });
  mockRequestLimits('983GB');
  mockVisits('983GB');
  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointment_requests?type=*',
    response: {
      data: {
        id: 'testing',
        attributes: {},
      },
    },
  }).as('appointmentRequests');
  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointment_requests/testing/messages',
    response: [],
  }).as('requestMessages');
}

export function initCommunityCareMock() {
  setupSchedulingMocks();

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
  }).as('appointmentRequests');

  cy.route({
    method: 'POST',
    url: '/vaos/v0/appointment_requests/testing/messages',
    response: [],
  }).as('requestMessages');
}
