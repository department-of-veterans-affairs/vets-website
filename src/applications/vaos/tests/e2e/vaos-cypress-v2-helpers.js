/* eslint-disable camelcase */
import { mockContactInformation } from '~/platform/user/profile/vap-svc/util/local-vapsvc';
import moment from '../../lib/moment-tz';
import schedulingConfigurations from '../../services/mocks/v2/scheduling_configurations.json';
import { getVAOSAppointmentMock } from '../mocks/v2';

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

export const mockFacilities = {
  data: [
    {
      id: '983',
      type: 'facilities',
      attributes: {
        id: '983',
        vistaSite: '983',
        vastParent: '983',
        type: 'va_facilities',
        name: 'Cheyenne VA Medical Center',
        classification: 'VA Medical Center (VAMC)',
        timezone: null,
        lat: 41.148179,
        long: -104.786159,
        website: 'https://www.cheyenne.va.gov/locations/directions.asp',
        phone: {
          main: '307-778-7550',
          fax: '307-778-7381',
          pharmacy: '866-420-6337',
          afterHours: '307-778-7550',
          patientAdvocate: '307-778-7550 x7517',
          mentalHealthClinic: '307-778-7349',
          enrollmentCoordinator: '307-778-7550 x7579',
        },
        hoursOfOperation: null,
        mailingAddress: null,
        physicalAddress: {
          type: 'physical',
          line: ['2360 East Pershing Boulevard'],
          city: 'Cheyenne',
          state: 'WY',
          postalCode: '82001-5356',
        },
        mobile: false,
        healthService: [
          'Audiology',
          'Cardiology',
          'DentalServices',
          'EmergencyCare',
          'Gastroenterology',
          'Gynecology',
          'MentalHealthCare',
          'Nutrition',
          'Ophthalmology',
          'Optometry',
          'Orthopedics',
          'Podiatry',
          'PrimaryCare',
          'SpecialtyCare',
          'UrgentCare',
          'Urology',
          'WomensHealth',
        ],
        operatingStatus: { code: 'NORMAL' },
      },
    },
    {
      id: '984',
      type: 'facilities',
      attributes: {
        id: '984',
        vistaSite: '984',
        vastParent: '984',
        type: 'va_health_facility',
        name: 'Dayton VA Medical Center',
        classification: 'VA Medical Center (VAMC)',
        timezone: null,
        lat: '39.7424427',
        long: '-84.2651895',
        website: 'https://www.dayton.va.gov/locations/directions.asp',
        phone: { main: '937-268-6511' },
        hoursOfOperation: null,
        mailingAddress: null,
        physicalAddress: {
          type: 'physical',
          line: ['4100 West Third Street'],
          city: 'Dayton',
          state: 'OH',
          postalCode: '45428-9000',
        },
        mobile: null,
        healthService: [
          'Audiology',
          'Cardiology',
          'DentalServices',
          'Dermatology',
          'Gastroenterology',
          'Gynecology',
          'MentalHealthCare',
          'Nutrition',
          'Ophthalmology',
          'Optometry',
          'Orthopedics',
          'Podiatry',
          'PrimaryCare',
          'SpecialtyCare',
          'Urology',
          'WomensHealth',
        ],
        operatingStatus: null,
      },
    },
  ],
};

export function mockFeatureToggles() {
  cy.intercept('/v0/feature_toggles*', {
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
          name: 'vaOnlineSchedulingFlatFacilityPage',
          value: true,
        },
        {
          name: 'vaOnlineSchedulingUnenrolledVaccine',
          value: true,
        },
        {
          name: 'vaGlobalDowntimeNotification',
          value: false,
        },

        {
          name: 'vaOnlineSchedulingVAOSServiceRequests',
          value: true,
        },
        {
          name: 'vaOnlineSchedulingVAOSServiceVAAppointments',
          value: true,
        },
        {
          name: 'vaOnlineSchedulingFacilitiesServiceV2',
          value: true,
        },
        {
          name: 'vaOnlineSchedulingVAOSServiceCCAppointments',
          value: true,
        },
        {
          name: 'vaOnlineSchedulingVariantTesting',
          value: false,
        },
        {
          name: 'vaOnlineSchedulingPocHealthApt',
          value: true,
        },
        {
          name: 'vaOnlineSchedulingStatusImprovement',
          value: true,
        },
      ],
    },
  }).as('featureToggles');
}

export function setupVaos() {
  Cypress.Commands.add('axeCheckBestPractice', (context = 'main') => {
    cy.axeCheck(context, {
      runOnly: {
        type: 'tag',
        values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
      },
    });
  });
}

export function setupPlatform() {
  mockFeatureToggles();

  cy.intercept('/v0/backend_statuses*', {
    data: {
      attributes: {
        statuses: [
          {
            service: 'Master Veterans Index (MVI)',
            serviceId: 'mvi',
            status: 'active',
            lastIncidentTimestamp: '2019-07-09T07:00:40.000-04:00',
          },
        ],
      },
    },
  }).as('backend-statuses');

  // 'OPTIONS /v0/maintenance_windows': 'OK',
  cy.intercept('/v0/maintenance_windows', { data: [] }).as(
    'maintenance-window',
  );
}

export function mockGetAppointmentSlots({
  locationId = '983',
  clinicId = '123',
  start = moment(),
  end = moment(),
}) {
  cy.intercept(
    {
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
  ).as('slots');
}

export function mockGetAppointments({ version } = { version: 0 }) {
  if (version === 2) {
    const now = moment();

    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      status: 'booked',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
      start: now.format('YYYY-MM-DDTHH:mm:ss'),
      end: now.format('YYYY-MM-DDTHH:mm:ss'),
    };

    cy.intercept(
      {
        pathname: '/vaos/v2/appointments',
        query: {
          _include: '*',
          start: '*',
          end: '*',
        },
      },
      { data: [appointment] },
    ).as('appointments-V2');
  } else {
    cy.intercept(
      {
        pathname: '/vaos/v0/appointments',
        query: { start_date: '*', end_date: '*', type: '*' },
      },
      req => {
        req.reply({
          data: [{ id: '1234', type: 'va_appointments', attributes: {} }],
        });
      },
    ).as('appointments-V0');
  }
}

export function mockGetSchedulingConfiguration() {
  cy.intercept(
    '/vaos/v2/scheduling/configurations*',
    schedulingConfigurations,
  ).as('scheduling-configurations');
}

export function mockGetFacilities() {
  cy.intercept(
    {
      pathname: '/vaos/v2/facilities',
      query: {
        children: '*',
        'ids[]': '*',
      },
    },
    req => {
      req.reply(mockFacilities);
    },
  ).as('facility');
}

export function mockGetEligibilityCC(typeOfCare = 'PrimaryCare') {
  cy.intercept(`/vaos/v0/community_care/eligibility/${typeOfCare}`, req => {
    req.reply({
      data: {
        id: 'PrimaryCare',
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    });
  }).as('eligibility-cc');
}

export function mockGetEligibility() {
  cy.intercept(
    {
      pathname: '/vaos/v2/eligibility',
      query: { facility_id: '*', clinical_service_id: '*', type: '*' },
    },
    req => {
      req.reply({
        data: {
          id: '123',
          type: 'eligibility',
          attributes: {
            clinicalServiceId: 'primaryCare',
            eligible: true,
            type: 'direct',
          },
        },
      });
    },
  ).as('eligibility');
}

export function mockGetClinics(locations = []) {
  locations.forEach(id => {
    cy.intercept(
      {
        pathname: `/vaos/v2/locations/${id}/clinics`,
        query: { clinical_service: '*' },
      },
      req => {
        req.reply({ data: [{ id: '123', type: 'clinics', attributes: {} }] });
      },
    ).as(`clinic-${id}`);
  });
}

export function mockVAOSAppointmentsApi() {
  mockGetAppointments();
  mockGetAppointments({ version: 2 });
  mockGetSchedulingConfiguration();
  mockGetFacilities();
  mockGetEligibilityCC();
  mockGetEligibility();
  mockGetClinics(['983', '984']);
  mockGetAppointmentSlots();
}
