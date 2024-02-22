const add = require('date-fns/add');
const { format, utcToZonedTime } = require('date-fns-tz');

const createVaosAppointment = ({
  startsInDays = 1,
  status = 'booked',
  kind = 'clinic',
} = {}) => {
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
    kind,
    status,
    locationId: '983',
    location: {
      id: '983',
      type: 'appointments',
      attributes: {
        id: '983',
        vistaSite: '983',
        name: 'Cheyenne VA Medical Center',
        timezone: {
          timeZoneId: 'America/Denver',
        },
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
    end: format(add(now, { hours: 3 }), "yyyy-MM-dd'T'HH:mm:ss"),
    get localStartTime() {
      return format(
        utcToZonedTime(now, this.location.attributes.timezone.timeZoneId),
        "yyyy-MM-dd'T'HH:mm:ssXXX",
        {
          timeZone: this.location.attributes.timezone.timeZoneId,
        },
      );
    },
  };
  return appointment;
};

const createVaosError = ({ status, title, customErrors = [] }) => {
  if (customErrors.length !== 0) {
    return {
      errors: customErrors,
    };
  }
  return {
    errors: [
      {
        status,
        code: status,
        title,
        detail: title,
      },
    ],
  };
};

module.exports = {
  createVaosAppointment,
  createVaosError,
};
