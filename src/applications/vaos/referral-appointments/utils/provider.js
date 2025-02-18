/* eslint-disable no-plusplus */
const dateFns = require('date-fns');
const dateFnsTz = require('date-fns-tz');

const providers = {
  '0': {
    id: '0',
    providerName: 'Dr. Perpetually Unavailable',
    typeOfCare: 'Physical Therapy',
    orgName: 'Ethereal Adjunct of Deferred Care',
    orgAddress: {
      street1: '421 Promethean Circuit',
      street2: 'Suite 300',
      street3: '',
      city: 'Portland',
      state: 'Oregon',
      zip: '97214',
    },
    orgPhone: '555-687-6736',
    driveTime: '1 hour drive',
    driveDistance: '100 miles',
    location: 'Hypothetical Adjunct Node, Sublime Care Complex',
  },
  '111': {
    id: '111',
    providerName: 'Dr. Bones',
    typeOfCare: 'Physical Therapy',
    orgName: 'Stronger Bone Technologies',
    orgAddress: {
      street1: '111 Lori Ln.',
      street2: '',
      street3: '',
      city: 'New York',
      state: 'New York',
      zip: '10016',
    },
    orgPhone: '555-600-8043',
    driveTime: '7 minute drive',
    driveDistance: '8 miles',
    location: 'Stronger bone technologies bldg 2',
  },
  '222': {
    id: '222',
    providerName: 'Dr. Peetee',
    typeOfCare: 'Physical Therapy',
    orgName: 'Physical Therapy Solutions',
    orgAddress: {
      street1: '222 John Dr.',
      street2: '',
      street3: '',
      city: 'New York',
      state: 'New York',
      zip: '10016',
    },
    orgPhone: '555-867-5309',
    driveTime: '3 minute drive',
    driveDistance: '20 miles',
    location: 'Physical Therapy Solutions World Headquarters',
  },
  '333': {
    id: '333',
    providerName: 'Dr. Smith',
    typeOfCare: 'Mental Health',
    orgName: 'Smith Mental Health Clinic',
    orgAddress: {
      street1: '333 Main St.',
      street2: '',
      street3: '',
      city: 'New York',
      state: 'New York',
      zip: '10016',
    },
    orgPhone: '555-555-5555',
    driveTime: '5 minute drive',
    driveDistance: '5 miles',
    location: 'Smith Mental Health Clinic',
  },
};

/**
 * Creates a provider object with a configurable number of slots an hour apart.
 *
 * @param {Number} numberOfSlots How many slots to create
 * @param {String} providerId The ID for the provider
 * @returns {Object} Provider object
 */
const createProviderDetails = (numberOfSlots, providerId = '111') => {
  const provider = providers[providerId];
  provider.slots = [];
  const tomorrow = dateFns.addDays(dateFns.startOfDay(new Date()), 1);
  let hourFromNow = 12;
  for (let i = 0; i < numberOfSlots; i++) {
    const startTime = dateFns.addHours(tomorrow, hourFromNow);
    provider.slots.push({
      end: dateFns.addMinutes(startTime, 30).toISOString(),
      id: i.toString(),
      start: startTime.toISOString(),
    });
    hourFromNow++;
  }
  return { ...provider };
};

const draftAppointments = {
  'add2f0f4-a1ea-4dea-a504-a54ab57c6800': {
    appointment: {
      id: 'EEKoGzEf',
      state: 'draft',
      patientId: 'care-nav-patient-casey',
    },
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    },
    slots: {
      count: 2,
      slots: [],
    },
    drivetime: {
      origin: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      destination: {
        distanceInMiles: 313,
        driveTimeInSecondsWithoutTraffic: 19096,
        driveTimeInSecondsWithTraffic: 19561,
        latitude: 44.475883,
        longitude: -73.212074,
      },
    },
  },
  'add2f0f4-a1ea-4dea-a504-a54ab57c6801': {
    appointment: {
      id: 'EEKoGzEf',
      state: 'draft',
      patientId: 'care-nav-patient-casey',
    },
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    },
    slots: {
      count: 2,
      slots: [],
    },
    drivetime: {
      origin: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      destination: {
        distanceInMiles: 313,
        driveTimeInSecondsWithoutTraffic: 19096,
        driveTimeInSecondsWithTraffic: 19561,
        latitude: 44.475883,
        longitude: -73.212074,
      },
    },
  },
  'add2f0f4-a1ea-4dea-a504-a54ab57c6802': {
    appointment: {
      id: 'EEKoGzEf',
      state: 'draft',
      patientId: 'care-nav-patient-casey',
    },
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    },
    slots: {
      count: 2,
      slots: [],
    },
    drivetime: {
      origin: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      destination: {
        distanceInMiles: 313,
        driveTimeInSecondsWithoutTraffic: 19096,
        driveTimeInSecondsWithTraffic: 19561,
        latitude: 44.475883,
        longitude: -73.212074,
      },
    },
  },
  'add2f0f4-a1ea-4dea-a504-a54ab57c6803': {
    appointment: {
      id: 'EEKoGzEf',
      state: 'draft',
      patientId: 'care-nav-patient-casey',
    },
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    },
    slots: {
      count: 2,
      slots: [],
    },
    drivetime: {
      origin: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      destination: {
        distanceInMiles: 313,
        driveTimeInSecondsWithoutTraffic: 19096,
        driveTimeInSecondsWithTraffic: 19561,
        latitude: 44.475883,
        longitude: -73.212074,
      },
    },
  },
  timeout: {
    appointment: {
      id: 'timeout-appointment-id',
      state: 'draft',
      patientId: 'care-nav-patient-casey',
    },
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    },
    slots: {
      count: 2,
      slots: [],
    },
    drivetime: {
      origin: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      destination: {
        distanceInMiles: 313,
        driveTimeInSecondsWithoutTraffic: 19096,
        driveTimeInSecondsWithTraffic: 19561,
        latitude: 44.475883,
        longitude: -73.212074,
      },
    },
  },
  'eps-error': {
    appointment: {
      id: 'eps-error-appointment-id',
      state: 'draft',
      patientId: 'care-nav-patient-casey',
    },
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
        },
      ],
      providerOrganization: {
        name: 'Meridian Health (Sandbox 5vuTac8v)',
      },
      location: {
        name: 'FHA South Melbourne Medical Complex',
        address: '1105 Palmetto Ave, Melbourne, FL, 32901, US',
        latitude: 28.08061,
        longitude: -80.60322,
        timezone: 'America/New_York',
      },
      networkIds: ['sandboxnetwork-5vuTac8v'],
      schedulingNotes:
        'New patients need to send their previous records to the office prior to their appt.',
      appointmentTypes: [
        {
          id: 'ov',
          name: 'Office Visit',
          isSelfSchedulable: true,
        },
      ],
      specialties: [
        {
          id: '208800000X',
          name: 'Urology',
        },
      ],
      visitMode: 'phone',
      features: {
        isDigital: true,
        directBooking: {
          isEnabled: true,
          requiredFields: ['phone', 'address', 'name', 'birthdate', 'gender'],
        },
      },
    },
    slots: {
      count: 2,
      slots: [],
    },
    drivetime: {
      origin: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      destination: {
        distanceInMiles: 313,
        driveTimeInSecondsWithoutTraffic: 19096,
        driveTimeInSecondsWithTraffic: 19561,
        latitude: 44.475883,
        longitude: -73.212074,
      },
    },
  },
};

/**
 * Creates a draftAppointmentInfo object with a configurable number of slots an hour apart.
 *
 * @param {Number} numberOfSlots How many slots to create
 * @param {String} referralId The ID for the referral
 * @returns {Object} draftAppointmentInfo object
 */
const createDraftAppointmentInfo = (
  numberOfSlots,
  referralId = 'add2f0f4-a1ea-4dea-a504-a54ab57c6800',
) => {
  const draftAppointmentInfo = draftAppointments[referralId];
  const tomorrow = dateFns.addDays(dateFns.startOfDay(new Date()), 1);
  draftAppointmentInfo.slots = { count: numberOfSlots, slots: [] };
  let hourFromNow = 12;
  for (let i = 0; i < numberOfSlots; i++) {
    const startTime = dateFns.addHours(tomorrow, hourFromNow);
    draftAppointmentInfo.slots.slots.push({
      id: `5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov${i.toString()}`,
      providerServiceId: '9mN718pH',
      appointmentTypeId: 'ov',
      start: startTime.toISOString(),
      remaining: 1,
    });
    hourFromNow++;
  }
  return { ...draftAppointmentInfo };
};

/**
 * Returns Slot by given date
 *
 * @param {Array} slots Array of slots
 * @param {String} dateTime Time stamp of date
 * @returns {Object} Slot object
 */
const getSlotByDate = (slots, dateTime) => {
  if (!slots) {
    return {};
  }
  return slots.find(slot => slot.start === dateTime);
};

/**
 * Returns Slot by given id
 *
 * @param {Array} slots Array of slots
 * @param {String} id Id for slot
 * @returns {Object} Slot object
 */
const getSlotById = (slots, id) => {
  if (!slots) {
    return {};
  }
  return slots.find(slot => slot.id === id);
};

/**
 * Returns if a selected date is in conflict with an existing appointment
 *
 * @param {String} selectedDate Date of selected appointment
 * @param {Object} appointmentsByMonth Existing appointments object
 * @param {String} facilityTimeZone Timezone string of facility
 * @returns {Boolean} Is there a conflict
 */
const hasConflict = (selectedDate, appointmentsByMonth, facilityTimeZone) => {
  let conflict = false;
  const selectedMonth = dateFns.format(new Date(selectedDate), 'yyyy-MM');
  if (!(selectedMonth in appointmentsByMonth)) {
    return conflict;
  }
  const selectedDay = dateFns.format(new Date(selectedDate), 'dd');
  const monthOfApts = appointmentsByMonth[selectedMonth];
  const daysWithApts = monthOfApts.map(apt => {
    return dateFns.format(new Date(apt.start), 'dd');
  });
  if (!daysWithApts.includes(selectedDay)) {
    return conflict;
  }
  const unavailableTimes = monthOfApts.map(upcomingAppointment => {
    return {
      start: dateFnsTz.zonedTimeToUtc(
        new Date(upcomingAppointment.start),
        upcomingAppointment.timezone,
      ),
      end: dateFnsTz.zonedTimeToUtc(
        dateFns.addMinutes(
          new Date(upcomingAppointment.start),
          upcomingAppointment.minutesDuration,
        ),
        upcomingAppointment.timezone,
      ),
    };
  });
  unavailableTimes.forEach(range => {
    if (
      dateFns.isWithinInterval(
        dateFnsTz.zonedTimeToUtc(new Date(selectedDate), facilityTimeZone),
        {
          start: range.start,
          end: range.end,
        },
      )
    ) {
      conflict = true;
    }
  });
  return conflict;
};

module.exports = {
  createDraftAppointmentInfo,
  createProviderDetails,
  draftAppointments,
  getSlotByDate,
  getSlotById,
  hasConflict,
};
