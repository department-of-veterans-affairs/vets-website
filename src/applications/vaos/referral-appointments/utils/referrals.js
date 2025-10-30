/* eslint-disable camelcase */
const { addDays, addMonths, format, subMonths } = require('date-fns');

const defaultUUIDBase = '6cg8T26YivnL68JzeTaV0w==';
const expiredUUIDBase = '445e2d1b-7150-4631-97f2-f6f473bdef';

const errorUUIDs = [
  'appointment-submit-error',
  'details-retry-error',
  'details-error',
  'draft-no-slots-error',
  'referral-without-provider-error',
  'eps-error-appointment-id',
];

const ALLOWED_CATEGORIES_OF_CARE = ['optometry'];
const CHIRO_FEATURE_ALLOWED_CATEGORY = ['chiropractic'];

/**
 * Creates a referral list object relative to a start date.
 *
 * @param {String} startDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {String} uuid The UUID for the referral
 * @param {String} categoryOfCare The category of care for the referral
 * @returns {Object} Referral object
 */

const createReferralListItem = (
  expirationDate,
  uuid,
  categoryOfCare = 'OPTOMETRY',
  stationId = '659',
) => {
  const [year, month, day] = expirationDate.split('-');
  const relativeDate = new Date(year, month - 1, day);
  const mydFormat = 'yyyy-MM-dd';
  return {
    id: uuid,
    type: 'referrals',
    attributes: {
      expirationDate:
        expirationDate || format(addMonths(relativeDate, 6), mydFormat),
      uuid,
      categoryOfCare,
      referralNumber: 'VA0000007241',
      referralConsultId: '984_646907',
      stationId,
    },
  };
};

/* Creates a list of error referrals with specific UUIDs.
 * These are used to test error handling.
 */
const errorReferralsList = (errorUUIDs || []).map(uuid => {
  return createReferralListItem('2025-11-14', uuid);
});

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
      hasAppointments: false,
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
 * Creates a referral array of any length.
 *
 * @param {Number} numberOfReferrals The number of referrals to create in the array
 * @param {String} baseDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @param {Number} numberOfExpiringReferrals The number of referrals that should be expired
 * @param {Boolean} includeErrorReferrals Whether to include error referrals in the array
 * @param {Boolean} includeOutOfPilotStation Whether to include an out of pilot station referral
 * @returns {Array} Referrals array
 */
const createReferrals = (
  numberOfReferrals = 3,
  baseDate,
  numberOfExpiringReferrals = 0,
  includeErrorReferrals = false,
  includeOutOfPilotStation = false,
) => {
  // create a date object for today that is not affected by the time zone
  const dateOjbect = baseDate ? new Date(baseDate) : new Date();
  const baseDateObject = new Date(
    dateOjbect.getUTCFullYear(),
    dateOjbect.getUTCMonth(),
    dateOjbect.getUTCDate(),
  );
  const referrals = [];

  const categoriesOfCare = ['OPTOMETRY', 'CHIROPRACTIC'];

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
    const categoryOfCare =
      i % 2 === 0 ? categoriesOfCare[1] : categoriesOfCare[0];
    referrals.push(
      createReferralListItem(
        expirationDate,
        `${uuidBase}${i.toString().padStart(2, '0')}`,
        categoryOfCare,
      ),
    );
  }
  if (includeOutOfPilotStation) {
    referrals.push(
      createReferralListItem(
        '2025-11-14',
        'out-of-pilot-station',
        'OPTOMETRY',
        '123',
      ),
    );
  }
  if (includeErrorReferrals) {
    return [...referrals, ...errorReferralsList];
  }
  return [...referrals];
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

module.exports = {
  createReferralById,
  createReferralListItem,
  createReferrals,
  getReferralSlotKey,
  filterReferrals,
  expiredUUIDBase,
  getAddressString,
};
