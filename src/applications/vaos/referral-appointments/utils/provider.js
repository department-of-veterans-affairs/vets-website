/* eslint-disable no-plusplus */
const dateFns = require('date-fns');
const dateFnsTz = require('date-fns-tz');

const providers = {
  '0': {
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

/**
 * Creates an address string from object
 *
 * @param {Object} addressObject Address object
 * @returns {String} Address string
 */
const getAddressString = addressObject => {
  let addressString = addressObject.street1;
  if (addressObject.street2) {
    addressString = `${addressString}, ${addressObject.street2}`;
  }
  if (addressObject.street3) {
    addressString = `${addressString}, ${addressObject.street3}`;
  }
  addressString = `${addressString}, ${addressObject.city}, ${
    addressObject.state
  }, ${addressObject.zip}`;
  return addressString;
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
  createProviderDetails,
  providers,
  getAddressString,
  getSlotByDate,
  getSlotById,
  hasConflict,
};
