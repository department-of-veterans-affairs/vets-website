/* eslint-disable no-plusplus */

const createDefaultDraftAppointment = () => ({
  id: 'EEKoGzEf',
  type: 'draft_appointment',
  attributes: {
    provider: {
      id: '9mN718pH',
      name: 'Dr. Bones @ FHA South Melbourne Medical Complex',
      isActive: true,
      individualProviders: [
        {
          name: 'Dr. Bones',
          npi: '91560381x',
          sex: 'female',
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
    slots: [],
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
});

/**
 * Creates a draftAppointmentInfo object with a configurable number of slots an hour apart.
 *
 * @param {Number} numberOfSlots How many slots to create
 * @param {String} referralNumber The number for the referral
 * @returns {Object} draftAppointmentInfo object
 */
const createDraftAppointmentInfo = (
  referralNumber = '6cg8T26YivnL68JzeTaV0w==',
) => {
  const draftApppointmentInfo = createDefaultDraftAppointment();

  if (referralNumber === 'draft-no-slots-error') {
    return draftApppointmentInfo;
  }
  if (referralNumber === 'details-error') {
    draftApppointmentInfo.id = 'details-error';
  }
  if (referralNumber === 'details-retry-error') {
    draftApppointmentInfo.id = 'details-retry-error';
  }
  draftApppointmentInfo.attributes.slots = [];
  return draftApppointmentInfo;
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

module.exports = {
  createDraftAppointmentInfo,
  getSlotByDate,
};
