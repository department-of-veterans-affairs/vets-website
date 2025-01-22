/* eslint-disable camelcase */

const { addDays, addMonths, format, subMonths } = require('date-fns');
const { providers } = require('./provider');

const defaultUUIDBase = 'add2f0f4-a1ea-4dea-a504-a54ab57c68';
const expiredUUIDBase = '445e2d1b-7150-4631-97f2-f6f473bdef';
/**
 * Creates a referral object relative to a start date.
 *
 * @param {String} startDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {String} uuid The UUID for the referral
 * @param {String} providerId The ID for the provider
 * @param {String} expirationDate The date in 'yyyy-MM-dd' format to expire the referral
 * @returns {Object} Referral object
 */
const createReferral = (
  startDate,
  uuid,
  providerId = '111',
  expirationDate,
) => {
  const [year, month, day] = startDate.split('-');
  const relativeDate = new Date(year, month - 1, day);

  const mydFormat = 'yyyy-MM-dd';
  const mydWithTimeFormat = 'yyyy-MM-dd kk:mm:ss';
  const provider = providers[providerId];

  return {
    ReferralCategory: 'Inpatient',
    ReferralDate: format(relativeDate, mydFormat),
    ReferralExpirationDate:
      expirationDate || format(addMonths(relativeDate, 6), mydFormat),
    ReferralLastUpdateDate: format(relativeDate, mydFormat),
    ReferralLastUpdateDateTime: format(relativeDate, mydWithTimeFormat),
    ReferralNumber: 'VA0000009880',
    ReferringFacility: 'Batavia VA Medical Center',
    ReferringProvider: '534_520824810',
    SourceOfReferral: 'Interfaced from VA',
    Status: 'Approved',
    CategoryOfCare: provider.typeOfCare,
    StationID: '528A4',
    Sta6: '534',
    ReferringProviderNPI: '534_520824810',
    ReferringFacilityInfo: {
      FacilityName: 'Batavia VA Medical Center',
      FacilityCode: '528A4',
      Description: 'Batavia VA Medical Center',
      Address: {
        Address1: '222 Richmond Avenue',
        City: 'BATAVIA',
        ZipCode: '14020',
      },
      Phone: '(585) 297-1000',
      Fax: '(585) 786-1258',
    },
    ReferralStatus: 'open',
    UUID: uuid,
    numberOfAppointments: 1,
    providerName: provider.providerName,
    providerLocation: provider.providerLocation,
    providerId,
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
      createReferral(
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
    referral => referral.CategoryOfCare === 'Physical Therapy',
  );
};

module.exports = {
  createReferral,
  createReferrals,
  getReferralSlotKey,
  filterReferrals,
};
