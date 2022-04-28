/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
// import { mockUser } from 'platform/testing/e2e/cypress/support/commands/login';

import moment from '../../lib/moment-tz';

import confirmedVA from '../../services/mocks/var/confirmed_va.json';
import confirmedCC from '../../services/mocks/var/confirmed_cc.json';
import requests from '../../services/mocks/var/requests.json';
import cancelReasons from '../../services/mocks/var/cancel_reasons.json';
import facilityData from '../../services/mocks/var/facility_data.json';
import directEligibilityCriteria from '../../services/mocks/var/direct_booking_eligibility_criteria.json';
//--------
import {
  getVAAppointmentMock,
  getExpressCareRequestCriteriaMock,
  getParentSiteMock,
} from '../mocks/v0';
import {
  mockAppointmentsApi,
  mockCCPrimaryCareEligibility,
  mockCCProviderApi,
  mockDirectBookingEligibilityCriteria,
  mockDirectScheduleSlots,
  mockDirectSchedulingFacilities,
  mockFacilityApi,
  mockFacilityDetails,
  mockFeatureToggleApi,
  mockLoginApi,
  mockPreferencesApi,
  mockPrimaryCareClinics,
  mockRequestEligibilityCriteria,
  mockRequestLimits,
  mockSubmitVAAppointment,
  mockSupportedSites,
  mockVaccineSlots,
  mockVisits,
  updateConfirmedCCDates,
  updateConfirmedVADates,
  updateRequestDates,
} from './vaos-cypress-routes';

export function vaosSetup() {
  Cypress.Commands.add('axeCheckBestPractice', (context = 'main') => {
    cy.axeCheck(context, {
      runOnly: {
        type: 'tag',
        values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
      },
    });
  });
  cy.server();
}

function setupSchedulingMocks({
  cernerFacility = false,
  withoutAddress = false,
} = {}) {
  vaosSetup();
  mockFeatureToggleApi({
    vaOnlineSchedulingFacilitiesServiceV2: false,
    vaOnlineSchedulingStatusImprovement: false,
    vaOnlineSchedulingVAOSServiceCCAppointments: false,
    vaOnlineSchedulingVAOSServiceRequests: false,
    vaOnlineSchedulingVAOSServiceVAAppointments: false,
  });

  mockLoginApi({ cernerFacility, withoutAddress });
  mockSupportedSites();
  mockCCPrimaryCareEligibility();
  mockRequestEligibilityCriteria();
  mockDirectBookingEligibilityCriteria();
  mockFacilityDetails();
  mockFacilityApi();
  mockDirectSchedulingFacilities();
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
  setupSchedulingMocks();

  const today = moment();
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va/vha_442',
    response: { data: facilityData.data[0] },
  }).as('v1:get:facilities:vha_442');
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
  initAppointmentListMock();
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

export function initVAAppointmentMock({ cernerFacility = false } = {}) {
  setupSchedulingMocks({ cernerFacility });
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va/vha_442',
    response: { data: facilityData.data[0] },
  });
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va?ids=*',
    response: facilityData,
  });
  cy.route({
    method: 'GET',
    url: '/vaos/v0/community_care/eligibility/Optometry',
    response: { data: { eligible: false } },
  });
  mockPrimaryCareClinics();
  mockRequestLimits();
  mockVisits();
  mockDirectScheduleSlots();
  mockSubmitVAAppointment();
}

export function initVaccineAppointmentMock({
  unableToScheduleCovid = false,
} = {}) {
  setupSchedulingMocks();
  // Modify directScheduling Response
  if (unableToScheduleCovid) {
    cy.route({
      method: 'GET',
      url: '/vaos/v0/direct_booking_eligibility_criteria*',
      response: {
        data: directEligibilityCriteria.data.map(facility => ({
          ...facility,
          attributes: {
            ...facility.attributes,
            coreSettings: facility.attributes.coreSettings.filter(
              f => f.id !== 'covid',
            ),
          },
        })),
      },
    });
  }
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va/vha_442',
    response: { data: facilityData.data[0] },
  });
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va?ids=*',
    response: facilityData,
  });
  mockPrimaryCareClinics();
  mockVaccineSlots();
  mockSubmitVAAppointment();
}

export function initVARequestMock({ cernerFacility = false } = {}) {
  setupSchedulingMocks({ cernerFacility });
  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/clinics*',
    response: { data: [] },
  });
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va/vha_442GB',
    response: { data: facilityData.data[0] },
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
  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointment_requests/testing',
    response: {
      data: requests.data[0],
    },
  });
}

export function initCommunityCareMock({ withoutAddress = false } = {}) {
  setupSchedulingMocks({ withoutAddress });

  mockAppointmentsApi({ apiVersion: 0 });
  mockCCProviderApi({ id: '1497723753' });
  mockPreferencesApi();
}
