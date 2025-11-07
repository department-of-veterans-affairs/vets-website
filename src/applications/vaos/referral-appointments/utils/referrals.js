/* eslint-disable camelcase */
const { addMonths, format } = require('date-fns');

const ALLOWED_CATEGORIES_OF_CARE = ['optometry'];
const CHIRO_FEATURE_ALLOWED_CATEGORY = ['chiropractic'];

/**
 * Creates a referral object with specified uuid and expiration date.
 *
 * @param {String} startDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {String} uuid The UUID for the referral
 * @param {String} expirationDate The date in 'yyyy-MM-dd' format to expire the referral
 * @param {String} categoryOfCare The category of care for the referral
 * @param {Boolean} hasProvider Whether the referral has a provider
 * @param {String} stationId The station id for the referral
 * @returns {Object} Referral object
 */
const createReferralById = (
  startDate,
  uuid,
  expirationDate,
  categoryOfCare = 'OPTOMETRY',
  hasProvider = true,
  stationId = '659BY',
) => {
  const [year, month, day] = startDate.split('-');
  const relativeDate = new Date(year, month - 1, day);

  const mydFormat = 'yyyy-MM-dd';

  const provider = hasProvider
    ? {
        name: 'Dr. Moreen S. Rafa',
        npi: '1346206547',
        phone: '(937) 236-6750',
        facilityName: 'fake facility name',
        address: {
          street1: '76 Veterans Avenue',
          city: 'BATH',
          state: null,
          zip: '14810',
        },
      }
    : null;

  return {
    id: uuid,
    type: 'referrals',
    attributes: {
      uuid,
      referralDate: '2023-01-01',
      stationId,
      expirationDate:
        expirationDate || format(addMonths(relativeDate, 6), mydFormat),
      referralNumber: uuid.includes('error') ? uuid : 'VA0000007241',
      categoryOfCare,
      referralConsultId: '984_646907',
      appointments: {
        system: 'EPS',
        data: [],
      },
      referringFacility: {
        name: 'Batavia VA Medical Center',
        phone: '(585) 297-1000',
        code: '528A4',
        address: {
          street1: '222 Richmond Avenue',
          city: 'BATAVIA',
          state: null,
          zip: '14020',
        },
      },
      provider,
    },
  };
};

/**
 * Returns the session key for a stored slot by referral id.
 *
 * @param {String} id The id of the referral.
 * @returns {String} The storage key.
 */
const getReferralSlotKey = id => {
  return `selected-slot-referral-${id}`;
};

/**
 * Filters referrals by category of care.
 * @param {Array} referrals The referrals to filter
 * @returns {Array} The filtered referrals
 */
const filterReferrals = (
  referrals,
  featureCCDirectSchedulingChiropractic = false,
) => {
  let allowedCategories = ALLOWED_CATEGORIES_OF_CARE;
  if (!referrals?.length) {
    return [];
  }
  if (featureCCDirectSchedulingChiropractic) {
    // Add chiropractic to allowed categories if feature is on
    allowedCategories = [
      ...allowedCategories,
      ...CHIRO_FEATURE_ALLOWED_CATEGORY,
    ];
  }
  return referrals.filter(referral =>
    allowedCategories.includes(
      referral.attributes.categoryOfCare?.toLowerCase(),
    ),
  );
};

/**
 * Creates an address string from object
 *
 * @param {Object} addressObject Address object
 * @returns {String} Address string
 */
const getAddressString = addressObject => {
  if (!addressObject) {
    return '';
  }
  const { street1, street2, street3, city, state, zip } = addressObject;

  const addressParts = [street1, street2, street3, city, state, zip];

  // Filter out any undefined or empty parts and join with a comma
  return addressParts.filter(Boolean).join(', ');
};

/**
 * Finds the next appointment by start date from an array of appointment systems.
 * Only returns booked appointments.
 *
 * @param {Array} appointmentSystems Array of appointment systems with format:
 *   [{system: 'VAOS', data: [{id: '1234', status: 'booked', start: 'datetimestring'}]}]
 * @returns {Object|null} Object with {id, system} of the next appointment, or null if none found
 */
const getNextAppointment = appointmentSystems => {
  if (!appointmentSystems?.length) {
    return null;
  }

  let nextAppointment = null;
  let earliestDate = null;

  appointmentSystems.forEach(appointmentSystem => {
    const { system, data } = appointmentSystem;

    if (!data?.length) {
      return;
    }

    data.forEach(appointment => {
      const { id, start, status } = appointment;

      // Only consider booked appointments
      if (status !== 'booked') {
        return;
      }

      if (!start) {
        return;
      }

      const appointmentDate = new Date(start);

      // Skip invalid dates
      if (Number.isNaN(appointmentDate.getTime())) {
        return;
      }

      // Skip past appointments
      const now = new Date();
      if (appointmentDate <= now) {
        return;
      }

      // Check if this is the earliest future appointment so far
      if (!earliestDate || appointmentDate < earliestDate) {
        earliestDate = appointmentDate;
        nextAppointment = { id, system };
      }
    });
  });

  return nextAppointment;
};

/**
 * Determines if a referral can be scheduled by checking for valid cancelled appointments.
 * Conservative approach - returns false if data is missing/null.
 * Returns true if no appointments exist (empty array) or if valid cancelled appointments exist.
 * Requires id, status, and valid start date for appointments to be considered valid.
 *
 * @param {Array} appointmentSystems Array of appointment systems with format:
 *   [{system: 'VAOS', data: [{id: '1234', status: 'booked', start: 'datetimestring'}]}]
 * @returns {Boolean} True if scheduling is allowed (no appointments or valid cancelled appointments exist), false otherwise
 */
const getCanBeScheduled = appointmentSystems => {
  if (!appointmentSystems?.length) {
    return false;
  }

  return appointmentSystems.every(appointmentSystem => {
    const { data } = appointmentSystem;

    if (!data) {
      return false;
    }

    if (!data.length) {
      return true; // Empty array means no appointments, so can be scheduled
    }

    // Check if there are only valid cancelled appointments
    // Be conservative - require both status and start to be present and valid
    return data.every(appointment => {
      const { id, status, start } = appointment;

      // Require all essential properties to be present
      if (!id || !status || !start) {
        return false;
      }

      // Only consider cancelled appointments as valid for scheduling
      return status === 'cancelled';
    });
  });
};

module.exports = {
  createReferralById,
  getReferralSlotKey,
  filterReferrals,
  getAddressString,
  getNextAppointment,
  getCanBeScheduled,
};
