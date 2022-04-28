/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import moment from 'moment';
import unset from 'platform/utilities/data/unset';
import { mockContactInformation } from 'platform/user/profile/vap-svc/util/local-vapsvc';

import clinicList983 from '../../services/mocks/var/clinicList983.json';
import confirmedCC from '../../services/mocks/var/confirmed_cc.json';
import confirmedVA from '../../services/mocks/var/confirmed_va.json';
import directEligibilityCriteria from '../../services/mocks/var/direct_booking_eligibility_criteria.json';
import facilities from '../../services/mocks/var/facilities.json';
import facilities983 from '../../services/mocks/var/facilities_983.json';
import facilityData from '../../services/mocks/var/facility_data.json';
import requestEligibilityCriteria from '../../services/mocks/var/request_eligibility_criteria.json';
import requests from '../../services/mocks/var/requests.json';
import slots from '../../services/mocks/var/slots.json';
import supportedSites from '../../services/mocks/var/sites-supporting-var.json';

// v2
import clinicsV2 from '../../services/mocks/v2/clinics.json';
import confirmedV2 from '../../services/mocks/v2/confirmed.json';
import facilitiesV2 from '../../services/mocks/v2/facilities.json';
import provider from '../../services/mocks/var/cc_providers.json';
import requestsV2 from '../../services/mocks/v2/requests.json';
import schedulingConfigurations from '../../services/mocks/v2/scheduling_configurations.json';
import { APPOINTMENT_STATUS } from '../../utils/constants';

const mockUser = {
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

export function updateConfirmedVADates(resp) {
  resp.data.forEach(item => {
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
  return resp;
}

export function updateConfirmedCCDates(resp) {
  resp.data.forEach(item => {
    const futureDateStr = moment()
      .add(4, 'days')
      .format('MM/DD/YYYY HH:mm:ss');

    item.attributes.appointmentTime = futureDateStr;
  });
  return resp;
}

export function updateRequestDates(resp) {
  resp.data.forEach(item => {
    const futureDateStr = moment()
      .add(5, 'days')
      .format('MM/DD/YYYY');

    item.attributes.optionDate1 = futureDateStr;
  });
  return resp;
}

export function updateTimeslots(resp) {
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

  resp.data[0].attributes.appointmentTimeSlot = [newSlot];

  return resp;
}

export function mockFeatureToggleApi({
  vaOnlineScheduling = true,
  vaOnlineSchedulingCancel = true,
  vaOnlineSchedulingRequests = true,
  vaOnlineSchedulingCommunityCare = true,
  vaOnlineSchedulingDirect = true,
  vaOnlineSchedulingPast = true,
  cerner_override_668 = false,
  vaOnlineSchedulingExpressCare = true,
  vaOnlineSchedulingFlatFacilityPage = true,
  vaOnlineSchedulingUnenrolledVaccine = true,
  vaGlobalDowntimeNotification = false,
  vaOnlineSchedulingVAOSServiceRequests = true,
  vaOnlineSchedulingVAOSServiceVAAppointments = true,
  vaOnlineSchedulingFacilitiesServiceV2 = true,
  vaOnlineSchedulingVAOSServiceCCAppointments = true,
  vaOnlineSchedulingVariantTesting = false,
  vaOnlineSchedulingPocHealthApt = true,
  vaOnlineSchedulingStatusImprovement = true,
} = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/v0/feature_toggles*',
    },
    req =>
      req.reply({
        data: {
          features: [
            { name: 'vaOnlineScheduling', value: vaOnlineScheduling },
            {
              name: 'vaOnlineSchedulingCancel',
              value: vaOnlineSchedulingCancel,
            },
            {
              name: 'vaOnlineSchedulingRequests',
              value: vaOnlineSchedulingRequests,
            },
            {
              name: 'vaOnlineSchedulingCommunityCare',
              value: vaOnlineSchedulingCommunityCare,
            },
            {
              name: 'vaOnlineSchedulingDirect',
              value: vaOnlineSchedulingDirect,
            },
            { name: 'vaOnlineSchedulingPast', value: vaOnlineSchedulingPast },
            { name: `cerner_override_668`, value: cerner_override_668 },
            {
              name: 'vaOnlineSchedulingExpressCare',
              value: vaOnlineSchedulingExpressCare,
            },
            {
              name: 'vaOnlineSchedulingFlatFacilityPage',
              value: vaOnlineSchedulingFlatFacilityPage,
            },
            {
              name: 'vaOnlineSchedulingUnenrolledVaccine',
              value: vaOnlineSchedulingUnenrolledVaccine,
            },
            {
              name: 'vaGlobalDowntimeNotification',
              value: vaGlobalDowntimeNotification,
            },
            {
              name: 'vaOnlineSchedulingVAOSServiceRequests',
              value: vaOnlineSchedulingVAOSServiceRequests,
            },
            {
              name: 'vaOnlineSchedulingVAOSServiceVAAppointments',
              value: vaOnlineSchedulingVAOSServiceVAAppointments,
            },
            {
              name: 'vaOnlineSchedulingFacilitiesServiceV2',
              value: vaOnlineSchedulingFacilitiesServiceV2,
            },
            {
              name: 'vaOnlineSchedulingVAOSServiceCCAppointments',
              value: vaOnlineSchedulingVAOSServiceCCAppointments,
            },
            {
              name: 'vaOnlineSchedulingVariantTesting',
              value: vaOnlineSchedulingVariantTesting,
            },
            {
              name: 'vaOnlineSchedulingPocHealthApt',
              value: vaOnlineSchedulingPocHealthApt,
            },
            {
              name: 'vaOnlineSchedulingStatusImprovement',
              value: vaOnlineSchedulingStatusImprovement,
            },
          ],
        },
      }),
  ).as('v0:get:features');
}

export function mockRequestLimits(id = '983') {
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

export function mockSupportedSites() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/community_care/supported_sites*',
    response: supportedSites,
  });
}

export function mockCCPrimaryCareEligibility() {
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

export function mockEligibilityApi() {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v2/eligibility',
      query: { facility_id: '*', clinical_service_id: '*', type: '*' },
    },
    req => {
      let { data } = requestEligibilityCriteria;
      if (req.query.type === 'direct') data = directEligibilityCriteria.data;
      req.reply({
        data,
      });
    },
  ).as('v2:get:eligibility');
}

export function mockClinicApi({
  clinicId,
  locations = [],
  apiVersion = 2,
} = {}) {
  if (apiVersion === 2) {
    locations.forEach(locationId => {
      const data = clinicsV2.data.filter(clinic => clinic.id === clinicId);
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

export function mockRequestEligibilityCriteria() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/request_eligibility_criteria*',
    response: requestEligibilityCriteria,
  });
}

export function mockDirectBookingEligibilityCriteria() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/direct_booking_eligibility_criteria*',
    response: directEligibilityCriteria,
  });
}

export function mockFacilityDetails() {
  cy.route({
    method: 'GET',
    url: '/v1/facilities/va?ids=*',
    response: facilityData,
  });
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
    cy.intercept(
      {
        method: 'GET',
        pathname: '/v1/facilities/va?ids=*',
      },
      { body: facilityData },
    ).as('v1:get:facilities');
    cy.intercept(
      {
        method: 'GET',
        pathname: '/v1/facilities/va/vha_442GC',
      },
      req =>
        req.reply({
          data: facilityData.data.find(f => f.id === 'vha_442GC'),
        }),
    ).as(`v1:get:facility`);
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

export function mockDirectSchedulingFacilities() {
  cy.route({
    method: 'GET',
    url: '/vaos/v0/systems/983/direct_scheduling_facilities*',
    response: facilities983,
  });
}

export function mockPrimaryCareClinics({ _apiVersion = 0 } = {}) {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/vaos/v0/facilities/*/clinics*',
    },
    { body: clinicList983 },
  ).as('v0:get:clinics');
}

export function mockSubmitVAAppointment() {
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

export function mockVisits(id = '983') {
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

export function mockDirectScheduleSlots({
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
          data: [{ id: '123', type: 'slots', attributes: { start, end } }],
        });
      },
    ).as('v2:get:slots');
  }
}

export function mockVaccineSlots() {
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

export function mockAppointmentsApi({
  _id,
  status = APPOINTMENT_STATUS.booked,
  apiVersion = 0,
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
          req.reply({
            data: updateConfirmedVADates(confirmedVA).data,
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
        method: 'GET',
        path: '/vaos/v0/appointment_requests',
      },
      req => {
        req.reply({
          data: updateRequestDates(requests),
        });
      },
    ).as('v0:get:requests');

    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v0/appointment_requests',
      },
      {
        body: {
          data: {
            id: 'testing',
            attributes: {},
          },
        },
      },
    ).as('v0:create:request');

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/appointment_requests/testing/messages',
      },
      req => {
        req.reply({
          data: requests.data[0],
        });
      },
    ).as('v0:get:request-messages');

    cy.intercept(
      {
        method: 'POST',
        pathname: '/vaos/v0/appointment_requests/testing/messages',
      },
      {
        body: {
          data: [],
        },
      },
    ).as('v0:create:request-message');

    cy.intercept(
      {
        method: 'GET',
        pathname: '/vaos/v0/appointment_requests/testing',
      },
      req => {
        req.reply({
          data: requests.data.find(r => r.attributes.ccAppointmentRequest),
        });
      },
    ).as('v0:get:request-message');
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

export function mockGetSchedulingConfiguration() {
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

export function mockLoginApi({
  cernerFacility = false,
  withoutAddress = false,
} = {}) {
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
}

export function mockCCProviderApi({ id, apiVersion = 1 } = {}) {
  if (apiVersion === 1) {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/facilities_api/v1/ccp/provider',
      },
      req => {
        let { data } = provider;
        if (id !== null && id !== undefined)
          data = provider.data.filter(p => p.attributes.uniqueId === id);
        req.reply({ data });
      },
    ).as('v1:get:provider');
  }
}
