import sinon from 'sinon';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { resetFetch } from '~/platform/testing/unit/helpers';
import environment from '~/platform/utilities/environment';

import {
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
} from '~/applications/personalization/dashboard/constants';

import { fetchConfirmedFutureAppointments } from './index';

function thisYear() {
  return new Date().getFullYear();
}

function nextYear() {
  return new Date().getFullYear() + 1;
}

const mockEmptyAppointmentData = {
  data: [],
  meta: {
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalPages: 0,
      totalEntries: 0,
    },
    errors: [],
  },
};

// A VAOS v2 appointment scheduled in the past and should be filtered out by the
// action creator
const pastAppointmentV2 = {
  id: '151207',
  type: 'appointments',
  attributes: {
    id: '151207',
    kind: 'telehealth',
    status: 'booked',
    locationId: '983',
    start: '2023-05-31T15:05:00Z',
    end: '2023-05-31T15:25:00Z',
    minutesDuration: '20',
    created: '2023-01-06T15:09:32.137Z',
    cancellable: true,
    patientInstruction: '',
    localStartTime: '2023-05-31T08:05:00.000-07:00',
    location: {
      id: '983',
      type: 'appointments',
      attributes: {
        id: '983',
        vistaSite: '983',
        vastParent: '983',
        type: 'va_facilities',
        name: 'Cheyenne VA Medical Center',
        classification: 'VA Medical Center (VAMC)',
        timezone: {
          timeZoneId: 'America/Denver',
        },
        lat: '39.744507',
        long: '-104.830956',
        physicalAddress: {
          type: 'physical',
          line: ['2360 East Pershing Boulevard'],
          city: 'Cheyenne',
          state: 'WY',
          postalCode: '82001-5356',
        },
        mobile: false,
      },
    },
  },
};

// A single appointment at facility 983, CHEYENNE WYOMING at midnight Jan 1 next
// year UTC.
const futureAppointmentV2 = {
  id: '193312',
  type: 'appointments',
  attributes: {
    id: '193312',
    kind: 'clinic',
    status: 'booked',
    patientIcn: '1012845943V900681',
    locationId: '983',
    clinic: '923',
    start: `${nextYear()}-01-01T00:00:00Z`,
    end: `${nextYear()}-01-01T00:00:00Z`,
    minutesDuration: '30',
    created: '2023-10-31T00:00:00Z',
    cancellable: true,
    localStartTime: `${nextYear()}-01-01T9:00:00.000-06:00`,
    location: {
      id: '983',
      type: 'appointments',
      attributes: {
        id: '983',
        vistaSite: '983',
        vastParent: '983',
        type: 'va_facilities',
        name: 'Cheyenne VA Medical Center',
        classification: 'VA Medical Center (VAMC)',
        timezone: {
          timeZoneId: 'America/Denver',
        },
        lat: '39.744507',
        long: '-104.830956',
        physicalAddress: {
          type: 'physical',
          line: ['2360 East Pershing Boulevard'],
          city: 'Cheyenne',
          state: 'WY',
          postalCode: '82001-5356',
        },
        mobile: false,
      },
    },
  },
};

const mockAppointmentDataV2 = {
  data: [futureAppointmentV2, pastAppointmentV2],
  meta: {
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalPages: 0,
      totalEntries: 0,
    },
    failures: [],
  },
};

// The important part of this mock facility data is that it returns data for
// facility ID 442 in Cheyenne, Wyoming, which matches the facility of the
// single appointment in the mockVAAppointmentData
const mockFacilityData = {
  data: [
    {
      id: 'vha_442',
      type: 'facility',
      attributes: {
        access: {
          health: [
            {
              service: 'Audiology',
              new: 18.305555,
              established: 4.158798,
            },
            {
              service: 'Cardiology',
              new: 18.9375,
              established: 20.305555,
            },
            { service: 'Dermatology', new: 0.0, established: null },
            {
              service: 'Gastroenterology',
              new: 7.5,
              established: 15.421052,
            },
            { service: 'Gynecology', new: 35.0, established: 15.235294 },
            {
              service: 'MentalHealthCare',
              new: 6.375,
              established: 5.204986,
            },
            {
              service: 'Ophthalmology',
              new: 14.166666,
              established: 18.217741,
            },
            {
              service: 'Optometry',
              new: 57.536585,
              established: 64.323076,
            },
            {
              service: 'Orthopedics',
              new: 20.943396,
              established: 7.179487,
            },
            {
              service: 'PrimaryCare',
              new: 16.972972,
              established: 12.035647,
            },
            {
              service: 'SpecialtyCare',
              new: 16.841079,
              established: 10.828016,
            },
            { service: 'Urology', new: 62.0, established: 37.333333 },
            { service: 'WomensHealth', new: 14.0, established: 14.723404 },
          ],
          effectiveDate: '2021-05-17',
        },
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
            address2: null,
            address3: null,
          },
        },
        classification: 'VA Medical Center (VAMC)',
        detailedServices: [
          {
            name: 'COVID-19 vaccines',
            descriptionFacility: null,
            appointmentLeadin:
              "Your VA health care team will contact you if you’re eligible to get a vaccine during this time. As the supply of vaccine increases, we'll work with our care teams to let Veterans know their options.",
            appointmentPhones: [
              {
                extension: null,
                label: 'Main phone',
                number: '307-778-7550',
                type: 'tel',
              },
            ],
            onlineSchedulingAvailable: null,
            referralRequired: 'true',
            walkInsAccepted: 'false',
            serviceLocations: null,
            path: 'https://www.cheyenne.va.gov/services/covid-19-vaccines.asp',
          },
        ],
        facilityType: 'va_health_facility',
        feedback: {
          health: {
            primaryCareUrgent: 0.6700000166893005,
            primaryCareRoutine: 0.8399999737739563,
            specialtyCareUrgent: 0.7200000286102295,
            specialtyCareRoutine: 0.800000011920929,
          },
          effectiveDate: '2021-03-05',
        },
        hours: {
          friday: '24/7',
          monday: '24/7',
          sunday: '24/7',
          tuesday: '24/7',
          saturday: '24/7',
          thursday: '24/7',
          wednesday: '24/7',
        },
        id: 'vha_442',
        lat: 41.148027,
        long: -104.7862575,
        mobile: false,
        name: 'Cheyenne VA Medical Center',
        operatingStatus: { code: 'NORMAL' },
        operationalHoursSpecialInstructions:
          'More hours are available for some services. To learn more, call our main phone number. |',
        phone: {
          fax: '307-778-7381',
          main: '307-778-7550',
          pharmacy: '866-420-6337',
          afterHours: '307-778-7550',
          patientAdvocate: '307-778-7550 x7517',
          mentalHealthClinic: '307-778-7349',
          enrollmentCoordinator: '307-778-7550 x7579',
        },
        services: {
          other: [],
          health: [
            'Audiology',
            'Cardiology',
            'Covid19Vaccine',
            'DentalServices',
            'Dermatology',
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
            'Urology',
            'WomensHealth',
          ],
          lastUpdated: '2021-05-17',
        },
        uniqueId: '442',
        visn: '19',
        website: 'https://www.cheyenne.va.gov/locations/directions.asp',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
    },
  },
  links: {
    self: `${
      environment.API_URL
    }/v1/facilities/va?ids=vha_442&page=1&per_page=10`,
    first: `${environment.API_URL}/v1/facilities/va?ids=vha_442&per_page=10`,
    prev: null,
    next: null,
    last: `${
      environment.API_URL
    }/v1/facilities/va?ids=vha_442&page=1&per_page=10`,
  },
};

// The default API mock that returns facility data
const mocks = [
  rest.get(`${environment.API_URL}/v1/facilities/va`, (_, res, ctx) => {
    return res(ctx.json(mockFacilityData));
  }),
];

describe('fetchConfirmedFutureAppointments', () => {
  let server;
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is no longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks);
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });
  it('correctly adds a timezone offset to the start date/time of appointments and filters out past appointments', async () => {
    const dispatch = sinon.spy();
    // mock the appointments API, making sure to return no VA appointments
    server.use(
      rest.get(
        `${environment.API_URL}/vaos/v2/appointments`,
        (req, res, ctx) => {
          if (req) {
            return res(ctx.json(mockAppointmentDataV2));
          }
          return res(ctx.json(mockEmptyAppointmentData));
        },
      ),
    );
    await fetchConfirmedFutureAppointments()(dispatch);

    expect(dispatch.firstCall.args[0].type).to.equal(
      FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
    );
    expect(dispatch.secondCall.args[0].type).to.equal(
      FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
    );

    const { appointments } = dispatch.secondCall.args[0];

    expect(appointments.length).to.equal(1);

    // Midnight Jan 1 UTC is 7PM Dec 31 Florida time
    expect(appointments[0].startsAt).to.equal(
      `${thisYear()}-12-31T17:00:00-07:00`,
    );
  });
});
