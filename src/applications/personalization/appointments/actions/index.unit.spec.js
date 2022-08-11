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

// A CC appointment in Florida at midnight Jan 1 next year UTC.
const futureCCAppointment = {
  id: '8a4885896a22f88f016a2c8834b1005d',
  type: 'cc_appointments',
  attributes: {
    appointmentRequestId: '8a4885896a22f88f016a2c8834b1005d',
    distanceEligibleConfirmed: true,
    name: { firstName: '', lastName: '' },
    providerPractice: 'Atlantic Medical Care',
    providerPhone: '(407) 555-1212',
    address: {
      street: '123 Main Street',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32826',
    },
    instructionsToVeteran: 'Please arrive 15 minutes ahead of appointment.',
    // appointmentTime timestamps are UTC
    appointmentTime: `01/01/${nextYear()} 00:00:00`,
    timeZone: '-05:00 EST',
  },
};

// A CC appointment with a date in the past that should be filtered out by the
// action creator.
const pastCCAppointment = {
  id: '8a4885896a22f88f016a2c8834b1005d',
  type: 'cc_appointments',
  attributes: {
    appointmentRequestId: '8a4885896a22f88f016a2c8834b1005d',
    distanceEligibleConfirmed: true,
    name: { firstName: '', lastName: '' },
    providerPractice: 'Atlantic Medical Care',
    providerPhone: '(407) 555-1212',
    address: {
      street: '123 Main Street',
      city: 'Orlando',
      state: 'FL',
      zipCode: '32826',
    },
    instructionsToVeteran: 'Please arrive 15 minutes ahead of appointment.',
    // appointmentTime timestamps are UTC
    appointmentTime: '01/01/2020 00:00:00',
    timeZone: '-05:00 EST',
  },
};

// A VA appointment scheduled for midnight Jan 2 next year UTC that has been
// cancelled by the patient and should be filtered out by the action creator
const cancelledVAAppointment = {
  id: '202105261615983000045500000000000000',
  type: 'va_appointments',
  attributes: {
    char4: null,
    clinicId: '455',
    clinicFriendlyName: null,
    communityCare: false,
    facilityId: '983',
    phoneOnly: null,
    startDate: `${nextYear()}-01-02T00:00:00Z`,
    sta6aid: '983',
    vdsAppointments: [
      {
        bookingNote: null,
        appointmentLength: null,
        id: '455;20210526.101500',
        appointmentTime: `${nextYear()}-01-02T00:00:00Z`,
        clinic: {
          name: 'CHY PC CASSIDY',
          specialty: 'PRIMARY CARE/MEDICINE',
          stopCode: '323',
          askForCheckIn: false,
          facilityCode: '983',
        },
        type: 'REGULAR',
        currentStatus: 'CANCELLED BY PATIENT',
      },
    ],
    vvsAppointments: [],
  },
};

// A single appointment at facility 442, CHEYENNE WYOMING at midnight Jan 1 next
// year UTC.
const futureVAAppointment = {
  id: '202101010000983000103800000000000000',
  type: 'va_appointments',
  attributes: {
    char4: 'CDQC',
    clinicId: '1038',
    clinicFriendlyName: 'COVID VACCINE CLIN1',
    communityCare: false,
    facilityId: '442',
    phoneOnly: null,
    startDate: `${nextYear()}-01-01T00:00:00Z`,
    sta6aid: '442',
    vdsAppointments: [
      {
        bookingNote: null,
        appointmentLength: '15',
        id: '1038;20210525.083000',
        appointmentTime: `${nextYear()}-01-01T00:00:00Z`,
        clinic: {
          name: 'COVID VACCINE CLIN1',
          specialty: 'GENERAL INTERNAL MEDICINE',
          stopCode: '301',
          askForCheckIn: false,
          facilityCode: '442',
        },
        type: 'REGULAR',
        currentStatus: 'FUTURE',
      },
    ],
    vvsAppointments: [],
  },
};

// A VA appointment scheduled in the past and should be filtered out by the
// action creator
const pastVAAppointment = {
  id: '202101010000983000103800000000000000',
  type: 'va_appointments',
  attributes: {
    char4: 'CDQC',
    clinicId: '1038',
    clinicFriendlyName: 'COVID VACCINE CLIN1',
    communityCare: false,
    facilityId: '442',
    phoneOnly: null,
    startDate: '2020-01-01T00:00:00Z',
    sta6aid: '442',
    vdsAppointments: [
      {
        bookingNote: null,
        appointmentLength: '15',
        id: '1038;20210525.083000',
        appointmentTime: '2020-01-01T00:00:00Z',
        clinic: {
          name: 'COVID VACCINE CLIN1',
          specialty: 'GENERAL INTERNAL MEDICINE',
          stopCode: '301',
          askForCheckIn: false,
          facilityCode: '442',
        },
        type: 'REGULAR',
        currentStatus: 'FUTURE',
      },
    ],
    vvsAppointments: [],
  },
};

const mockCCAppointmentData = {
  data: [futureCCAppointment, pastCCAppointment],
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

const mockVAAppointmentData = {
  data: [cancelledVAAppointment, futureVAAppointment, pastVAAppointment],
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
  it('correctly adds a timezone offset to the start date/time of CC appointments and filters out past appointments', async () => {
    const dispatch = sinon.spy();
    // mock the appointments API, making sure to return no VA appointments
    server.use(
      rest.get(
        `${environment.API_URL}/vaos/v0/appointments`,
        (req, res, ctx) => {
          const type = req.url.searchParams.get('type');
          if (type === 'cc') {
            return res(ctx.json(mockCCAppointmentData));
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
      `${thisYear()}-12-31T19:00:00-05:00`,
    );
  });
  it('correctly adds a timezone offset to the start date/time of VA appointments and filters out canceled and past appointments', async () => {
    const dispatch = sinon.spy();
    // mock the appointments API, making sure to return no CC appointments
    server.use(
      rest.get(
        `${environment.API_URL}/vaos/v0/appointments`,
        (req, res, ctx) => {
          const type = req.url.searchParams.get('type');
          if (type === 'va') {
            return res(ctx.json(mockVAAppointmentData));
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
    // Midnight Jan 1 UTC is 5PM Dec 31 Cheyenne (Mountain) time
    expect(appointments[0].startsAt).to.equal(
      `${thisYear()}-12-31T17:00:00-07:00`,
    );
  });
});
