/* eslint-disable camelcase */
const { addDays, addMonths, format, subMonths } = require('date-fns');

const defaultUUIDBase = 'add2f0f4-a1ea-4dea-a504-a54ab57c68';
const expiredUUIDBase = '445e2d1b-7150-4631-97f2-f6f473bdef';

/**
 * Creates a referral list object relative to a start date.
 *
 * @param {String} startDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {String} uuid The UUID for the referral
 * @param {String} expirationDate The date in 'yyyy-MM-dd' format to expire the referral
 * @returns {Object} Referral object
 */

const createReferralListItem = (
  expirationDate,
  uuid,
  categoryOfCare = 'Physical Therapy',
) => {
  const [year, month, day] = expirationDate.split('-');
  const relativeDate = new Date(year, month - 1, day);
  const mydFormat = 'yyyy-MM-dd';
  return {
    attributes: {
      expirationDate:
        expirationDate || format(addMonths(relativeDate, 6), mydFormat),
      uuid,
      categoryOfCare,
    },
  };
};

/**
 * Creates a referral object with specified uuid and expiration date.
 *
 * @param {String} uuid The UUID for the referral
 * @param {String} expirationDate The date in 'yyyy-MM-dd' format to expire the referral
 * @returns {Object} Referral object
 */
const createReferralById = (
  startDate,
  uuid,
  providerId = '111',
  expirationDate,
  categoryOfCare = 'Physical Therapy',
  noSlots,
) => {
  const [year, month, day] = startDate.split('-');
  const relativeDate = new Date(year, month - 1, day);

  const mydFormat = 'yyyy-MM-dd';

  const generateReferralNumber = () => {
    if (noSlots) {
      return 'no-slots';
    }
    return 'VA0000009880-default';
  };
  const referralNumber = generateReferralNumber();

  return {
    id: uuid,
    type: 'referrals',
    attributes: {
      uuid,
      referralDate: '2023-01-01',
      stationId: '528A4',
      expirationDate:
        expirationDate || format(addMonths(relativeDate, 6), mydFormat),
      referralId: referralNumber,
      categoryOfCare,
      referringFacilityInfo: {
        name: 'Batavia VA Medical Center',
        code: '528A4',
        address: {
          address1: '222 Richmond Avenue',
          city: 'BATAVIA',
          state: null,
          zipCode: '14020',
        },
        phone: '(585) 297-1000',
      },
      provider: {
        name: 'Dr. Moreen S. Rafa',
        location: 'FHA South Melbourne Medical Complex',
        npi: '1346206547',
        telephone: '(937) 236-6750',
        providerId,
      },
      hasAppointments: false,
    },
  };
};

/**
 * Creates a referral array of any length.
 *
 * @param {Number} numberOfReferrals The number of referrals to create in the array
 * @param {String} baseDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {Number} numberOfExpiringReferrals The number of referrals that should be expired
 * @returns {Array} Referrals array
 */
const createReferrals = (
  numberOfReferrals = 3,
  baseDate,
  numberOfExpiringReferrals = 0,
) => {
  // create a date object for today that is not affected by the time zone
  const dateOjbect = baseDate ? new Date(baseDate) : new Date();
  const baseDateObject = new Date(
    dateOjbect.getUTCFullYear(),
    dateOjbect.getUTCMonth(),
    dateOjbect.getUTCDate(),
  );
  const referrals = [];
  for (let i = 0; i < numberOfReferrals; i++) {
    const isExpired = i < numberOfExpiringReferrals;
    const uuidBase = isExpired ? expiredUUIDBase : defaultUUIDBase;
    // make expiration date 6 months from the base date
    // or 6 months before the base date if expired
    // and add i days
    const modifiedDate = addDays(
      isExpired ? subMonths(baseDateObject, 6) : addMonths(baseDateObject, 6),
      i,
    );
    const mydFormat = 'yyyy-MM-dd';
    const expirationDate = format(modifiedDate, mydFormat);
    referrals.push(
      createReferralListItem(
        expirationDate,
        `${uuidBase}${i.toString().padStart(2, '0')}`,
      ),
    );
  }
  return referrals;
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
const filterReferrals = referrals => {
  if (!referrals?.length) {
    return [];
  }

  return referrals.filter(
    referral => referral.attributes.categoryOfCare === 'Physical Therapy',
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
  const { address1, address2, address3, city, state, zipCode } = addressObject;

  const addressParts = [address1, address2, address3, city, state, zipCode];

  // Filter out any undefined or empty parts and join with a comma
  return addressParts.filter(Boolean).join(', ');
};

module.exports = {
  createReferralById,
  createReferralListItem,
  createReferrals,
  getReferralSlotKey,
  filterReferrals,
  expiredUUIDBase,
  getAddressString,
};
