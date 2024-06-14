const fns = require('date-fns');

const MOCK_VA_APPOINTMENTS = {
  data: [
    {
      id: 'c3e3e32701e23fdf389c06eae00fcb24',
      type: 'va_appointments',
      attributes: {
        startDate: fns.formatISO(fns.addDays(Date.now(), 35)),
        sta6aid: null,
        clinicId: null,
        clinicFriendlyName: null,
        facilityId: '983',
        communityCare: null,
        vdsAppointments: [],
        vvsAppointments: [
          {
            id: '465f0120-e268-4f66-bdbf-96f44d9ad3a9',
            appointmentKind: 'ADHOC',
            sourceSystem: 'PV',
            dateTime: fns.formatISO(fns.addDays(Date.now(), 35)),
            desiredDate: fns.formatISO(fns.addDays(Date.now(), 35)),
            duration: 30,
            status: {
              description: 'F',
              code: 'FUTURE',
            },
            schedulingRequestType: 'NEXT_AVAILABLE_APPT',
            type: 'REGULAR',
            instructionsOther: false,
            patients: [
              {
                name: {
                  firstName: 'JUDY',
                  lastName: 'MORRISON',
                },
                contactInformation: {
                  mobile: '8888888888',
                  preferredEmail: 'test@va.gov',
                  timeZone: '10',
                },
                location: {
                  type: 'NonVA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                  },
                },
                patientAppointment: true,
                invities: [
                  {
                    email: 'test@va.gov',
                    name: {
                      firstName: 'Jane',
                      lastName: 'Doe',
                    },
                    inviteType: 'CAREGIVER',
                  },
                ],
                virtualMeetingRoom: {
                  conference: 'VAC00064b6f',
                  pin: '4569928835#',
                  url:
                    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VAC00064b6f@care2.evn.va.gov&pin=4569928835#',
                },
              },
            ],
            providers: [
              {
                name: {
                  firstName: 'Meg',
                  lastName: 'Smith',
                },
                contactInformation: {
                  preferredEmail: 'test@va.gov',
                  timeZone: '10',
                },
                location: {
                  type: 'VA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                  },
                },
                virtualMeetingRoom: {
                  conference: 'VAC00064b6f',
                  pin: '5784382206#',
                  url:
                    'https://care2.evn.va.gov/vvc-app/?name=Balboni%2CJeffrey&join=1&media=1&escalate=1&conference=VAC00064b6f@care2.evn.va.gov&pin=5784382206#',
                },
              },
            ],
            tasInfo: {
              siteCode: '9931',
              slotId: 'Slot8',
              confirmationCode: '7VBBCA',
              address: {
                streetAddress: '114 Dewey Ave',
                city: 'Eureka',
                state: 'MT',
                zipCode: '59917',
                country: 'USA',
                longitude: -115.1,
                latitude: 48.8,
                additionalDetails: '',
              },
              contacts: [
                {
                  name: 'Decker Konya',
                  phone: '5557582786',
                  email: 'Decker.Konya@va.gov',
                },
              ],
            },
          },
        ],
      },
    },
    {
      id: 'a784f714fa1606e39dee11e3bdbb7901',
      type: 'va_appointments',
      attributes: {
        startDate: fns.formatISO(fns.addDays(Date.now(), 31)),
        sta6aid: '983',
        clinicId: '848',
        clinicFriendlyName: 'CHY PC VAR2',
        facilityId: '983',
        communityCare: false,
        vdsAppointments: [],
        vvsAppointments: [
          {
            id: 'CB2349303442341141231a',
            appointmentKind: 'CLINIC_BASED',
            sourceSystem: 'TMP',
            dateTime: fns.formatISO(fns.addDays(Date.now(), 31)),
            desiredDate: '2021-10-10T17:40:00Z',
            duration: 20,
            status: {
              description: 'F',
              code: 'FUTURE',
            },
            schedulingRequestType: 'NEXT_AVAILABLE_APPT',
            type: 'REGULAR',
            bookingNotes: 'Test',
            instruction: 'this is a test of instruction',
            instructionsOther: true,
            patients: [
              {
                name: {
                  firstName: 'John',
                  lastName: 'Morrison',
                },
                contactInformation: {
                  mobile: '1234567890',
                  preferredEmail: 'fake@email.gov',
                  timeZone: '10',
                  timeZoneName: 'America/Denver',
                },
                location: {
                  type: 'VA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                    timeZoneName: 'America/Denver',
                  },
                  clinic: {
                    ien: '848',
                    name: 'CHY PC VAR2',
                  },
                },
                patientAppointment: true,
              },
            ],
            providers: [
              {
                contactInformation: {
                  mobile: '9912567890',
                  preferredEmail: 'fake@email.gov',
                  timeZone: '10',
                  timeZoneName: 'America/Denver',
                },
                location: {
                  type: 'VA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                    timeZoneName: 'America/Denver',
                  },
                  clinic: {
                    ien: '848',
                    name: 'CHY PC VAR2',
                  },
                },
                vistaDateTime: '2019-12-10T17:45:00Z',
              },
            ],
          },
        ],
      },
    },
    {
      id: '00abc6741c00ac67b6cbf6b972d084z0',
      type: 'va_appointments',
      attributes: {
        startDate: fns.formatISO(fns.addDays(Date.now(), 3)),
        clinicId: '308',
        clinicFriendlyName: null,
        facilityId: '983',
        sta6aid: '983GC',
        communityCare: true,
        vdsAppointments: [
          {
            bookingNote: 'past CC vista appt',
            appointmentLength: '60',
            appointmentTime: fns.formatISO(fns.addDays(Date.now(), 3)),
            clinic: {
              name: 'CHY OPT VAR1',
              askForCheckIn: false,
              facilityCode: '983',
            },
            type: 'REGULAR',
            currentStatus: 'NO ACTION TAKEN/TODAY',
          },
        ],
        vvsAppointments: [],
      },
    },
    {
      id: '20abc6741c00ac67b6cbf6b972d084c1',
      type: 'va_appointments',
      attributes: {
        startDate: fns.formatISO(fns.addDays(Date.now(), 2)),
        clinicId: '308',
        clinicFriendlyName: 'Neighborhood Clinic',
        facilityId: '983',
        sta6aid: '983GC',
        communityCare: true,
        vdsAppointments: [
          {
            bookingNote: 'CC vista appt',
            appointmentLength: '60',
            appointmentTime: fns.formatISO(fns.addDays(Date.now(), 2)),
            clinic: {
              name: 'CHY OPT VAR1',
              askForCheckIn: false,
              facilityCode: '983',
            },
            type: 'REGULAR',
            currentStatus: 'NO ACTION TAKEN/TODAY',
          },
        ],
        vvsAppointments: [],
      },
    },
    {
      id: '05760f00c80ae60ce49879cf37a05fc8',
      type: 'va_appointments',
      attributes: {
        startDate: fns.formatISO(fns.addDays(Date.now(), 1)),
        clinicId: null,
        clinicFriendlyName: null,
        facilityId: '983',
        communityCare: false,
        vdsAppointments: [],
        vvsAppointments: [
          {
            id: '8a74bdfa-0e66-4848-87f5-0d9bb413ae6d',
            appointmentKind: 'ADHOC',
            sourceSystem: 'SM',
            dateTime: fns.formatISO(fns.addDays(Date.now(), 1)),
            duration: 20,
            status: { description: 'F', code: 'FUTURE' },
            schedulingRequestType: 'NEXT_AVAILABLE_APPT',
            type: 'REGULAR',
            bookingNotes: 'T+90 Testing',
            instructionsOther: false,
            instructionsTitle: 'Video Visit Preparation',
            patients: [
              {
                name: { firstName: 'JUDY', lastName: 'MORRISON' },
                contactInformation: {
                  mobile: '7036520000',
                  preferredEmail: 'marcy.nadeau@va.gov',
                },
                location: {
                  type: 'NonVA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                  },
                },
                patientAppointment: true,
                virtualMeetingRoom: {
                  conference: 'VVC8275247',
                  pin: '3242949390#',
                  url:
                    'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
                },
              },
            ],
            providers: [
              {
                name: { firstName: 'Test T+90', lastName: 'Test' },
                contactInformation: {
                  mobile: '8888888888',
                  preferredEmail: 'marcy.nadeau@va.gov',
                  timeZone: '10',
                },
                location: {
                  type: 'VA',
                  facility: {
                    name: 'CHEYENNE VAMC',
                    siteCode: '983',
                    timeZone: '10',
                  },
                },
                virtualMeetingRoom: {
                  conference: 'VVC8275247',
                  pin: '7172705#',
                  url:
                    'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
                },
              },
            ],
          },
        ],
      },
    },
    {
      id: '22cdc6741c00ac67b6cbf6b972d084c0',
      type: 'va_appointments',
      attributes: {
        startDate: fns.formatISO(fns.addDays(Date.now(), 5)),
        clinicId: '308',
        clinicFriendlyName: null,
        facilityId: '983',
        sta6aid: '983',
        communityCare: false,
        phoneOnly: true,
        vdsAppointments: [
          {
            bookingNote: 'Medication concern: test',
            appointmentLength: '60',
            appointmentTime: fns.formatISO(fns.addDays(Date.now(), 5)),
            clinic: {
              name: 'CHY OPT VAR1',
              askForCheckIn: false,
              facilityCode: '983',
            },
            type: 'REGULAR',
            currentStatus: 'NO ACTION TAKEN/TODAY',
          },
        ],
        vvsAppointments: [],
      },
    },
  ],
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

module.exports = {
  MOCK_VA_APPOINTMENTS,
};
