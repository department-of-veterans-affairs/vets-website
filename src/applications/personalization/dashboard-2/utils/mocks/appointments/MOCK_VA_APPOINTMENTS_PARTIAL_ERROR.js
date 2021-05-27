// When we cannot get all of the VA appointment data there will be an entry in
// the meta.errors array
export default {
  data: [
    {
      id: '202106221300984000118400000000000000',
      type: 'va_appointments',
      attributes: {
        char4: null,
        clinicId: '1184',
        clinicFriendlyName: 'C&P OPTOMETRY',
        communityCare: false,
        facilityId: '984',
        phoneOnly: null,
        startDate: '2021-06-22T13:00:00Z',
        sta6aid: '984',
        vdsAppointments: [
          {
            bookingNote: 'Follow-up/Routine: pink eye',
            appointmentLength: '30',
            id: '1184;20210622.090000',
            appointmentTime: '2021-06-22T13:00:00Z',
            clinic: {
              name: 'DAY COMP & PEN OPTOMETRY',
              specialty: 'OPTOMETRY',
              stopCode: '408',
              askForCheckIn: false,
              facilityCode: '984',
            },
            type: 'REGULAR',
            currentStatus: 'FUTURE',
          },
        ],
        vvsAppointments: [],
      },
    },
    {
      id: '202107191200984000358300000000000000',
      type: 'va_appointments',
      attributes: {
        char4: null,
        clinicId: '3583',
        clinicFriendlyName: 'AUDIOLOGY CONSULTANT-2 (AM)',
        communityCare: false,
        facilityId: '984',
        phoneOnly: null,
        startDate: '2021-07-19T12:00:00Z',
        sta6aid: '984',
        vdsAppointments: [
          {
            bookingNote: null,
            appointmentLength: null,
            id: '3583;20210719.080000',
            appointmentTime: '2021-07-19T12:00:00Z',
            clinic: {
              name: 'DAY AUDIOLOGY SWANK',
              specialty: 'AUDIOLOGY',
              stopCode: '203',
              askForCheckIn: false,
              facilityCode: '984',
            },
            type: 'REGULAR',
            currentStatus: 'CANCELLED BY PATIENT',
          },
        ],
        vvsAppointments: [],
      },
    },
    {
      id: '202112131300984000358300000000000000',
      type: 'va_appointments',
      attributes: {
        char4: null,
        clinicId: '3583',
        clinicFriendlyName: 'AUDIOLOGY CONSULTANT-2 (AM)',
        communityCare: false,
        facilityId: '984',
        phoneOnly: null,
        startDate: '2021-12-13T13:00:00Z',
        sta6aid: '984',
        vdsAppointments: [
          {
            bookingNote: 'My reason isn’t listed: art',
            appointmentLength: '15',
            id: '3583;20211213.080000',
            appointmentTime: '2021-12-13T13:00:00Z',
            clinic: {
              name: 'DAY AUDIOLOGY SWANK',
              specialty: 'AUDIOLOGY',
              stopCode: '203',
              askForCheckIn: false,
              facilityCode: '984',
            },
            type: 'REGULAR',
            currentStatus: 'FUTURE',
          },
        ],
        vvsAppointments: [],
      },
    },
  ],
  meta: {
    pagination: { currentPage: 0, perPage: 0, totalPages: 0, totalEntries: 0 },
    errors: [
      {
        code: 500,
        source: '983',
        summary:
          'Could not get appointments from VistA Scheduling Service (0a65c33e-1feb-4cf6-9fc6-9e0d70f1fc73)',
      },
    ],
  },
};
