const format = require('date-fns/format');
const add = require('date-fns/add');

export function createMockAppointmentByVersion({
  id = null,
  email = null,
  phone = null,
  _currentStatus = null,
  _version = 2,
  _clinicFriendlyName = null,
  _clinicName = null,
  communityCareProvider = null,
  _timezone = null,
  // ...fields
} = {}) {
  return {
    id,
    type: 'appointments',
    attributes: {
      id,
      cancelationReason: null,
      clinic: null,
      comment: null,
      contact: {
        telecom: [
          { type: 'phone', value: phone },
          { type: 'email', value: email },
        ],
      },
      description: null,
      end: null,
      kind: null,
      locationId: null,
      minutesDuration: null,
      patientInstruction: 'Video Visit Preparation plus extra data',
      practitioners: communityCareProvider
        ? [
            {
              identifier: [
                {
                  system: 'http://hl7.org/fhir/sid/us-npi',
                  value: communityCareProvider.uniqueId,
                },
              ],
            },
          ]
        : null,
      preferredTimesForPhoneCall: null,
      priority: null,
      reason: null,
      requestedPeriods: null,
      serviceType: null,
      slot: null,
      // start:
      //   fields.kind === 'cc' && !fields.requestedPeriods?.length
      //     ? moment(fields.start)
      //         .utc()
      //         .format()
      //     : null,
      status: null,
      telehealth: null,
      extension: {
        ccLocation: communityCareProvider,
      },
      // ...fieldsWithoutProps,
    },
  };
}
const createVaosAppointment = ({ startsInDays = 1 }) => {
  const now = add(new Date(), { days: startsInDays });

  const appointment = {
    id: null,
    type: 'appointments',
    attributes: {
      cancelationReason: null,
      clinic: null,
      comment: null,
      contact: {
        telecom: [],
      },
      description: null,
      end: null,
      id: null,
      kind: null,
      locationId: null,
      minutesDuration: null,
      patientInstruction: null,
      practitioners: [],
      preferredTimesForPhoneCall: [],
      priority: null,
      reason: null,
      requestedPeriods: null,
      serviceType: null,
      slot: null,
      start: null,
      status: 'booked',
      telehealth: null,
    },
  };
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
    start: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
    end: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
  };
  return appointment;
};

module.exports = {
  createVaosAppointment,
};
