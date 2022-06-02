/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import unset from 'platform/utilities/data/unset';
import { mockContactInformation } from 'platform/user/profile/vap-svc/util/local-vapsvc';

import moment from '../../lib/moment-tz';

import confirmedVA from '../../services/mocks/var/confirmed_va.json';
import confirmedCC from '../../services/mocks/var/confirmed_cc.json';
import requests from '../../services/mocks/var/requests.json';
import cancelReasons from '../../services/mocks/var/cancel_reasons.json';
import supportedSites from '../../services/mocks/var/sites-supporting-var.json';
import facilities from '../../services/mocks/var/facilities.json';
import facilityData from '../../services/mocks/var/facility_data.json';
import facilities983 from '../../services/mocks/var/facilities_983.json';
import clinicList983 from '../../services/mocks/var/clinicList983.json';
import slots from '../../services/mocks/var/slots.json';
import requestEligibilityCriteria from '../../services/mocks/var/request_eligibility_criteria.json';
import directEligibilityCriteria from '../../services/mocks/var/direct_booking_eligibility_criteria.json';

import {
  getVAAppointmentMock,
  getExpressCareRequestCriteriaMock,
  getParentSiteMock,
} from '../mocks/v0';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import facilitiesV2 from '../../services/mocks/v2/facilities.json';
import schedulingConfigurations from '../../services/mocks/v2/scheduling_configurations.json';
import clinicsV2 from '../../services/mocks/v2/clinics.json';
import confirmedV2 from '../../services/mocks/v2/confirmed.json';
import requestsV2 from '../../services/mocks/v2/requests.json';

export const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'form-save-in-progress',
        'form-prefill',
        'evss-claims',
        'form526',
        'user-profile',
        'appeals-status',
        'identity-proofed',
      ],
      account: {
        accountUuid: '6af59b36-f14d-482e-88b4-3d7820422343',
      },
      profile: {
        email: 'vets.gov.user+228@gmail.com',
        firstName: 'MARK',
        middleName: null,
        lastName: 'WEBB',
        birthDate: '1950-10-04',
        gender: 'M',
        zip: null,
        lastSignedIn: '2020-06-18T21:15:19.664Z',
        loa: {
          current: 3,
          highest: 3,
        },
        multifactor: true,
        verified: true,
        signIn: {
          serviceName: 'idme',
          accountType: 'N/A',
        },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3/vets',
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19501004',
        familyName: 'Webb-ster',
        gender: 'M',
        givenNames: ['Mark'],
        isCernerPatient: false,
        facilities: [
          {
            facilityId: '556',
            isCerner: false,
          },
          {
            facilityId: '668',
            isCerner: false,
          },
        ],
        vaPatient: true,
        mhvAccountState: 'NONE',
      },
      veteranStatus: null,
      inProgressForms: [],
      prefillsAvailable: [
        '21-686C',
        '40-10007',
        '22-1990',
        '22-1990N',
        '22-1990E',
        '22-1995',
        '22-1995S',
        '22-5490',
        '22-5495',
        '22-0993',
        '22-0994',
        'FEEDBACK-TOOL',
        '22-10203',
        '21-526EZ',
        '1010ez',
        '21P-530',
        '21P-527EZ',
        '686C-674',
        '20-0996',
        'MDOT',
      ],
      vet360ContactInformation: mockContactInformation,
    },
  },
  meta: {
    errors: [
      {
        externalService: 'EMIS',
        startTime: '2020-06-18T21:15:34Z',
        endTime: null,
        description:
          'IOError, Betamocks default response requested but none exist. Please create one at: [/cache/emis/veteran_status/default.yml]., Betamocks default response requested but none exist. Please create one at: [/cache/emis/veteran_status/default.yml].',
        status: 503,
      },
    ],
  },
};

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

export function mockFeatureToggles({
  v2Requests = false,
  v2Facilities = false,
  v2DirectSchedule = false,
} = {}) {
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
            name: `cerner_override_668`,
            value: false,
          },
          {
            name: 'vaOnlineSchedulingVAOSServiceRequests',
            value: v2Requests,
          },
          {
            name: 'vaOnlineSchedulingVAOSServiceVAAppointments',
            value: v2DirectSchedule,
          },
          {
            name: 'vaOnlineSchedulingFacilitiesServiceV2',
            value: v2Facilities,
          },
        ],
      },
    },
  });
}

function mockRequestLimits(id = '983') {
  cy.route({
    method: 'GET',
    url: `/vaos/v0/facilities/limits*`,
    response: {
      data: [
        {
          id,
          attributes: {
            requestLimit: 1,
            numberOfRequests: 0,
          },
        },
      ],
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
    response: facilityData,
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
  cy.route({
    method: 'GET',
    url: '/vaos/v0/preferences',
    response: { data: {} },
  });
  cy.route({
    method: 'PUT',
    url: '/vaos/v0/preferences',
    response: { data: {} },
  }).as('appointmentPreferences');
}

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
  mockFeatureToggles();

  if (cernerFacility) {
    const mockCernerUser = {
      ...mockUser,
      data: {
        ...mockUser.data,
        attributes: {
          ...mockUser.data.attributes,
          vaProfile: {
            ...mockUser.data.attributes.vaProfile,
            facilities: [
              ...mockUser.data.attributes.vaProfile.facilities,
              { facilityId: cernerFacility, isCerner: true },
            ],
          },
        },
      },
    };
    cy.login(mockCernerUser);
  } else if (withoutAddress) {
    const mockUserWithoutAddress = unset(
      'data.attributes.vet360ContactInformation.residentialAddress.addressLine1',
      mockUser,
    );
    cy.login(mockUserWithoutAddress);
  } else {
    cy.login(mockUser);
  }

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
    .add(1, 'months')
    .startOf('month')
    .day(9)
    .format('YYYY-MM-DDTHH:mm:ss[+00:00]');
  const endDateTime = moment()
    .add(1, 'months')
    .startOf('month')
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

function mockVaccineSlots() {
  const startDateTime = moment()
    .add(1, 'day')
    .add(1, 'months')
    .startOf('month')
    .day(9)
    .format('YYYY-MM-DDTHH:mm:ss[+00:00]');
  const endDateTime = moment()
    .add(1, 'day')
    .add(1, 'months')
    .startOf('month')
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

  slots.data[0].attributes.appointmentTimeSlot = [newSlot];

  cy.route({
    method: 'GET',
    url: '/vaos/v0/facilities/983/available_appointments*',
    response: slots,
  });
}

export function initAppointmentListMock() {
  setupSchedulingMocks();

  const today = moment();
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va/vha_442',
    response: { data: facilityData.data[0] },
  });
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

  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointments?start_date=*&end_date=*&type=va',
    response: updateConfirmedVADates(confirmedVA),
  });
  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointments?start_date=*&end_date=*&type=cc',
    response: updateConfirmedCCDates(confirmedCC),
  });
  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointment_requests*',
    response: updateRequestDates(requests),
  });

  cy.route({
    method: 'GET',
    url: '/facilities_api/v1/ccp/provider*',
    response: {
      data: [
        {
          id: '1497723753',
          type: 'provider',
          attributes: {
            accNewPatients: 'true',
            address: {
              street: '1012 14TH ST NW STE 700',
              city: 'WASHINGTON',
              state: 'DC',
              zip: '20005-3477',
            },
            caresitePhone: '202-638-0750',
            email: null,
            fax: null,
            gender: 'Male',
            lat: 38.903195,
            long: -77.032382,
            name: 'Doe, Jane',
            phone: null,
            posCodes: null,
            prefContact: null,
            uniqueId: '1497723753',
          },
          relationships: {
            specialties: {
              data: [
                { id: '363L00000X', type: 'specialty' },
                { id: '363LP2300X', type: 'specialty' },
              ],
            },
          },
        },
      ],
    },
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

  cy.route({
    method: 'GET',
    url: '/vaos/v0/appointment_requests/testing',
    response: {
      data: requests.data.find(r => r.attributes.ccAppointmentRequest),
    },
  });
}

export function mockAppointmentsApi({
  status = APPOINTMENT_STATUS.booked,
  apiVersion = 2,
} = {}) {
  if (apiVersion === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/appointments',
        query: { start_date: '*', end_date: '*', type: '*' },
      },
      req => {
        if (req.query.type === 'va') {
          const { data } = updateConfirmedVADates(confirmedVA);
          req.reply({
            data,
          });
        } else if (req.query.type === 'cc') {
          req.reply({
            data: updateConfirmedCCDates(confirmedCC).data,
          });
        }
      },
    ).as('v0:get:appointments');
    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v0/appointments',
      },
      req => {
        req.reply({});
      },
    ).as('v0:create:appointment');
  } else if (apiVersion === 2) {
    const db = [];

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/appointments',
        query: {
          _include: '*',
          start: '*',
          end: '*',
        },
      },
      req => {
        if (status === APPOINTMENT_STATUS.booked) {
          req.reply({
            data: confirmedV2.data.filter(a => a.id === '00aa456va'),
          });
        } else if (status === APPOINTMENT_STATUS.pending) {
          req.reply({ data: requestsV2.data.filter(r => r.id === '25957') });
        } else req.reply({});
      },
    ).as('v2:get:appointments');

    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v2/appointments',
      },
      req => {
        // Save and return the same appointment back to the caller with a new simulated
        // appointment id. The saved appointment is used in the next 'v2:get:appointment'
        // api call.
        const newAppointment = {
          data: {
            id: 'mock1',
            attributes: {
              ...req.body,
              start: req.body.slot ? req.body.slot.start : null,
              cancellable: req.body.status,
            },
          },
        };

        db.push(newAppointment.data);
        req.reply(newAppointment);
      },
    ).as('v2:create:appointment');

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/appointments/mock1',
        query: {
          _include: '*',
        },
      },
      req => {
        req.reply({
          data: db[0],
        });
      },
    ).as('v2:get:appointment');
  }
}

export function mockFacilityApi({ id, count, apiVersion = 0 } = {}) {
  if (apiVersion === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/facilities',
        query: {
          'facility_codes[]': '*',
        },
      },
      req => {
        const f = facilities.data.slice(0, count);
        req.reply({ data: f });
      },
    ).as('v0:get:facilities');
  } else if (apiVersion === 1) {
    const facilityId = Array.isArray(id) ? id[0] : id;
    cy.intercept(
      {
        method: 'GET',
        pathname: `/v1/facilities/va/${facilityId}`,
      },
      req => {
        req.reply({ data: facilityData.data.find(f => f.id === facilityId) });
      },
    ).as('v1:get:facility');
    cy.intercept(
      {
        method: 'GET',
        pathname: '/v1/facilities/va',
        query: {
          ids: '*',
        },
      },
      req => {
        const tokens = req.query.ids.split(',');
        const data = tokens.map(token => {
          return facilityData.data.find(f => f.id === token);
        });
        // TODO: remove the harded coded id.
        // req.reply({
        //   data: facilityData.data.filter(f => f.id === 'vha_442GC'),
        // });
        // const f = facilities.data.slice(0);
        req.reply({ data });
      },
    ).as(`v1:get:facilities`);
  } else if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v2/facilities/${id}`,
      },
      req => {
        const facility = facilitiesV2.data.find(f => f.id === id);
        req.reply({
          data: facility,
        });
      },
    ).as(`v2:get:facility`);

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/facilities',
        query: {
          children: '*',
          'ids[]': '*',
        },
      },
      req => {
        req.reply(facilitiesV2);
      },
    ).as('v2:get:facilities');
  }
}

export function mockSchedulingConfigurationApi() {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/scheduling/configurations*',
    },
    req => {
      req.reply({ data: schedulingConfigurations.data });
    },
  ).as('scheduling-configurations');
}

export function mockEligibilityApi({
  typeOfCare = 'primaryCare',
  isEligible = false,
  apiVersion = 2,
} = {}) {
  if (apiVersion === 2) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v2/eligibility',
        query: { facility_id: '*', clinical_service_id: '*', type: '*' },
      },
      req => {
        // let { data } = requestEligibilityCriteria;
        // if (req.query.type === 'direct') {
        // data = directEligibilityCriteria.data;
        req.reply({
          data: {
            id: req.query.facility_id,
            type: 'eligibility',
            attributes: {
              clinicalServiceId: typeOfCare,
              eligible: isEligible,
              type: req.query.type,
            },
          },
        });
        //   req.reply({
        //     data,
        //   });
      },
    ).as('v2:get:eligibility');
  }
}
export function mockCCEligibilityApi({
  typeOfCare = 'PrimaryCare',
  isEligible = true,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      url: `/vaos/v0/community_care/eligibility/${typeOfCare}`,
    },
    req => {
      req.reply({
        data: {
          id: typeOfCare,
          type: 'cc_eligibility',
          attributes: { eligible: isEligible },
        },
      });
    },
  ).as('v0:get:cc-eligibility');
}

export function mockClinicApi({
  clinicId,
  facilityId,
  locations = [],
  apiVersion = 2,
} = {}) {
  if (apiVersion === 0) {
    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v0/facilities/${facilityId}/clinics*`,
      },
      req => {
        req.reply({ data: clinicList983.data });
      },
    ).as('v0:get:clinics');
  } else if (apiVersion === 2) {
    locations.forEach(locationId => {
      let { data } = clinicsV2;
      if (clinicId) data = data.filter(clinic => clinic.id === clinicId);

      cy.intercept(
        {
          method: 'GET',
          path: `/vaos/v2/locations/${locationId}/clinics?clinical_service*`,
        },
        req => {
          req.reply({
            data,
          });
        },
      ).as(`v2:get:clinics`);

      cy.intercept(
        {
          method: 'GET',
          // path: `/vaos/v2/locations/${locationId}/clinics\\?clinic_ids[]**`,
          path: `/vaos/v2/locations/${locationId}/clinics\\?clinic_ids%5B%5D**`,
        },
        req => {
          req.reply({
            data,
          });
        },
      ).as('v2:get:clinic');
    });
  }
}

export function mockDirectScheduleSlotsApi({
  locationId = '983',
  clinicId,
  start = moment(),
  end = moment(),
  apiVersion = 0,
} = {}) {
  if (apiVersion === 0) {
    cy.route({
      method: 'GET',
      url: '/vaos/v0/facilities/983/available_appointments*',
      response: updateTimeslots(slots),
    }).as('v0:get:slots');
  } else if (apiVersion === 2) {
    const _start = moment(start)
      // Set moment to 'utc' mode so formatting will contain 'Z' like api call
      .utc()
      .add(1, 'month')
      .startOf('month')
      .add(4, 'days');
    const _end = moment(end).utc();

    cy.intercept(
      {
        method: 'GET',
        pathname: `/vaos/v2/locations/${locationId}/clinics/${clinicId}/slots`,
        query: {
          start: '*',
          end: '*',
        },
      },
      req => {
        req.reply({
          data: [
            {
              id: '123',
              type: 'slots',
              attributes: { start: _start.format(), end: _end.format() },
            },
          ],
        });
      },
    ).as('v2:get:slots');
  }
}

export function mockLoginApi({
  cernerFacilityId,
  withoutAddress = false,
} = {}) {
  if (cernerFacilityId) {
    cy.log('Cerner enabled');
    const mockCernerUser = {
      ...mockUser,
      data: {
        ...mockUser.data,
        attributes: {
          ...mockUser.data.attributes,
          vaProfile: {
            ...mockUser.data.attributes.vaProfile,
            facilities: [
              ...mockUser.data.attributes.vaProfile.facilities,
              { facilityId: cernerFacilityId, isCerner: true },
            ],
          },
        },
      },
    };
    cy.login(mockCernerUser);
  } else if (withoutAddress) {
    const mockUserWithoutAddress = unset(
      'data.attributes.vet360ContactInformation.residentialAddress.addressLine1',
      mockUser,
    );
    cy.login(mockUserWithoutAddress);
  } else {
    cy.login(mockUser);
  }
}

export function mockPreferencesApi() {
  cy.intercept(
    { method: 'GET', pathname: '/vaos/v0/preferences' },
    { data: {} },
  ).as('v0:get:preferences');

  cy.intercept({ method: 'PUT', pathname: '/vaos/v0/preferences' }, req => {
    expect(req.body).to.have.property('emailAddress', 'veteran@gmail.com');
    expect(req.body).to.have.property('emailAllowed', true);
    expect(req.body).to.have.property(
      'notificationFrequency',
      'Each new message',
    );
    req.reply({ data: {} });
  }).as('v0:update:preferences');
}
