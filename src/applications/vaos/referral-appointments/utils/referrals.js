/* eslint-disable camelcase */

const { addDays, addMonths, format, subMonths } = require('date-fns');

const defaultUUIDBase = 'add2f0f4-a1ea-4dea-a504-a54ab57c68';
const expiredUUIDBase = '445e2d1b-7150-4631-97f2-f6f473bdef';

/**
 * Creates a referral list object relative to a start date.
 *
 * @param {String} startDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {String} uuid The UUID for the referral
 * @param {String} providerId The ID for the provider
 * @param {String} expirationDate The date in 'yyyy-MM-dd' format to expire the referral
 * @returns {Object} Referral object
 */

const createReferralListItem = (
  startDate,
  uuid,
  providerId = '111',
  expirationDate,
  categoryOfCare = 'Physical Therapy',
) => {
  const [year, month, day] = startDate.split('-');
  const relativeDate = new Date(year, month - 1, day);
  const mydFormat = 'yyyy-MM-dd';
  return {
    uuid,
    referralDate: startDate,
    categoryOfCare,
    expirationDate:
      expirationDate || format(addMonths(relativeDate, 6), mydFormat),
    providerId,
  };
};

/**
 * Creates a referral object relative to a start date.
 *
 * @param {String} startDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {String} uuid The UUID for the referral
 * @param {String} providerId The ID for the provider
 * @param {String} expirationDate The date in 'yyyy-MM-dd' format to expire the referral
 * @returns {Object} Referral object
 */
const createReferralById = (
  startDate,
  uuid,
  providerId = '111',
  expirationDate,
  categoryOfCare = 'Physical Therapy',
) => {
  const [year, month, day] = startDate.split('-');
  const relativeDate = new Date(year, month - 1, day);

  const mydFormat = 'yyyy-MM-dd';

  return {
    uuid,
    referralDate: format(relativeDate, mydFormat),
    expirationDate:
      expirationDate || format(addMonths(relativeDate, 6), mydFormat),
    referralNumber: 'VA0000009880',
    status: 'Approved',
    categoryOfCare,
    stationId: '528A4',
    sta6: '534',
    referringFacility: 'Batavia VA Medical Center',
    referringFacilityInfo: {
      facilityName: 'Batavia VA Medical Center',
      facilityCode: '528A4',
      description: 'Batavia VA Medical Center',
      address: {
        address1: '222 Richmond Avenue',
        city: 'BATAVIA',
        state: 'NY',
        zipCode: '14020',
      },
      phone: '(585) 297-1000',
    },
    referralStatus: 'open',
    provider: {
      id: providerId,
      name: 'Dr. Moreen S. Rafa',
      location: 'FHA South Melbourne Medical Complex',
    },
    appointments: [],
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
  const [year, month, day] = baseDate.split('-');
  const baseDateObject = new Date(year, month - 1, day);
  const referrals = [];
  const providerIds = ['111', '222', '0', '333'];

  for (let i = 0; i < numberOfReferrals; i++) {
    const isExpired = i < numberOfExpiringReferrals;
    const uuidBase = isExpired ? expiredUUIDBase : defaultUUIDBase;
    const startDate = addDays(
      isExpired ? subMonths(baseDateObject, 6) : baseDateObject,
      i,
    );
    const mydFormat = 'yyyy-MM-dd';
    const referralDate = format(startDate, mydFormat);
    referrals.push(
      createReferralListItem(
        referralDate,
        `${uuidBase}${i.toString().padStart(2, '0')}`,
        providerIds[i % providerIds.length],
        isExpired ? format(addDays(startDate, 6), mydFormat) : undefined,
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
    referral => referral.categoryOfCare === 'Physical Therapy',
  );
};

/**
 * Creates an address string from object
 *
 * @param {Object} addressObject Address object
 * @returns {String} Address string
 */
const getAddressString = addressObject => {
  let addressString = addressObject.address1;
  if (addressObject.address2) {
    addressString = `${addressString}, ${addressObject.address2}`;
  }
  if (addressObject.street3) {
    addressString = `${addressString}, ${addressObject.address3}`;
  }
  addressString = `${addressString}, ${addressObject.city}, ${addressObject.state}, ${addressObject.zipCode}`;
  return addressString;
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
