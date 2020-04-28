import ADDRESS_DATA from './data';

const STATE_NAMES = ADDRESS_DATA.states;
const MILITARY_STATES = new Set(ADDRESS_DATA.militaryStates);
const UNITED_STATES = 'USA';

/**
 * @typedef {string} AddressType
 */

/**
 * @readonly
 * @enum {AddressType}
 */
export const ADDRESS_TYPES = {
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  military: 'MILITARY',
};

/**
 * @typedef {object} Address
 * @property {AddressType} type
 * @property {string} countryName
 * @property {string} [addressLine1]
 * @property {string} [addressLine2]
 * @property {string} [addressLine3]
 * @property {string} [addressEffectiveAt]
 * @property {string} [city]
 * @property {string} [stateCode]
 * @property {string} [zipCode]
 * @property {string} [zipSuffix]
 * @property {string} [militaryPostOfficeTypeCode]
 * @property {string} [militaryStateCode]
 */

/**
 * Converts an address into a standardized format so that military address follow the same interface as other address types.
 * If type is Military, then the countryName property is added and set to USA, militaryPostOfficeTypeCode is renamed to city, and militaryStateCode to stateCode.
 * Non-military addresses are unaffected.
 * @param {Address} address
 * @returns {Address} A new Address object
 */
export function consolidateAddress(address) {
  const consolidated = {
    ...address,
  };

  if (consolidated.type === ADDRESS_TYPES.military) {
    consolidated.city = consolidated.militaryPostOfficeTypeCode;
    consolidated.stateCode = consolidated.militaryStateCode;
    consolidated.countryName = UNITED_STATES;
    delete consolidated.militaryPostOfficeTypeCode;
    delete consolidated.militaryStateCode;
  }

  delete consolidated.addressEffectiveDate;
  return consolidated;
}

/**
 * @param {Address} address
 * @returns {AddressType}
 */
function getInferredAddressType(address) {
  if (address.countryName !== UNITED_STATES) return ADDRESS_TYPES.international;
  if (MILITARY_STATES.has(address.stateCode)) return ADDRESS_TYPES.military;
  return ADDRESS_TYPES.domestic;
}

/**
 * Converts an address that may have been modified or standardized and needs its type to be inferred.
 * If type is Military, the inverse conversion of 'consolidateAddress' is performed.
 * Non-military addresses are unaffected.
 * @param {Address} address
 * @returns {Address} A new Address object
 */
export function expandAddress(address) {
  const expanded = {
    ...address,
    type: getInferredAddressType(address),
  };

  if (expanded.type === ADDRESS_TYPES.military) {
    expanded.militaryPostOfficeTypeCode = expanded.city;
    expanded.militaryStateCode = expanded.stateCode;
    delete expanded.city;
    delete expanded.stateCode;
    delete expanded.countryName;
  }

  return expanded;
}

/**
 * Returns whether or not the address is considered empty
 * @param {Address} address
 * @returns {boolean}
 */
export function isEmptyAddress(address) {
  const ignore = ['type', 'countryName', 'addressEffectiveDate'];

  if (address) {
    return Object.keys(address)
      .filter(prop => !ignore.includes(prop))
      .every(prop => !address[prop]);
  }

  return true;
}

/**
 * Accepts an abbreviation and returns the full state name
 * @param {string} abbreviation
 * @returns {string}
 */
export function getStateName(abbreviation = '') {
  return STATE_NAMES[abbreviation.toUpperCase()];
}

/**
 * Accepts any address and returns an object containing the fields formatted for display
 * @param {Address} address
 * @returns {object} An object containing properties for street, cityStateZip, and country. The country property is returned as the empty string if USA, because that value is so common it isn't usually displayed.
 */
export function formatAddress(address) {
  /* eslint-disable prefer-template */

  const {
    addressLine1,
    addressLine3,
    addressLine2,
    city,
    countryName,
    internationalPostalCode,
    militaryPostOfficeTypeCode,
    militaryStateCode,
    province,
    stateCode,
    type,
    zipCode,
  } = address;

  const country = type === ADDRESS_TYPES.international ? countryName : '';
  let cityStateZip = '';

  const street =
    [addressLine1, addressLine2, addressLine3]
      .filter(item => item)
      .join(', ') || '';

  switch (type) {
    case ADDRESS_TYPES.domestic:
      cityStateZip = city || '';
      if (city && stateCode) cityStateZip += ', ';
      if (stateCode) cityStateZip += getStateName(stateCode);
      if (zipCode) cityStateZip += ' ' + zipCode;
      break;

    case ADDRESS_TYPES.military:
      cityStateZip = militaryPostOfficeTypeCode || '';
      if (militaryPostOfficeTypeCode && militaryStateCode) cityStateZip += ', ';
      if (militaryStateCode) cityStateZip += militaryStateCode;
      if (zipCode) cityStateZip += ' ' + zipCode;
      break;

    // For international addresses we add a comma after the province
    case ADDRESS_TYPES.international:
      cityStateZip =
        [city, province, internationalPostalCode]
          .filter(item => item)
          .join(', ') || '';
      break;

    default:
      cityStateZip = address.city;
  }

  return { street, cityStateZip, country };
}
