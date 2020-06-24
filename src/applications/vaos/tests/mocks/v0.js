/*
 * Skeleton mocks for different backend data responses
 * Avoid dependening on the data in specific fields in here in your tests, prefer to 
 * set field data in your test function
 */

export function getVAAppointmentMock() {
  return {
    id: '21cdc6741c00ac67b6cbf6b972d084c1',
    type: 'va_appointments',
    attributes: {
      clinicFriendlyName: 'Fake',
      clinicId: 'fake',
      facilityId: 'fake',
      sta6aid: 'fake',
      communityCare: false,
      vdsAppointments: [
        {
          bookingNote: null,
          appointmentLength: '60',
          appointmentTime: 'fake',
          clinic: {
            name: 'fake',
            askForCheckIn: false,
            facilityCode: 'fake',
          },
          type: 'REGULAR',
          currentStatus: 'fake',
        },
      ],
      vvsAppointments: [],
    },
  };
}

export function getVAFacilityMock() {
  return {
    id: 'vha_fake',
    type: 'va_facilities',
    attributes: {
      uniqueId: 'fake',
      name: 'Fake name',
      address: {
        physical: {
          zip: 'fake zip',
          city: 'Fake city',
          state: 'FA',
          address1: 'Fake street',
          address2: null,
          address3: null,
        },
      },
      phone: {
        main: 'Fake phone',
      },
      hours: {},
    },
  };
}
