import countries from 'platform/user/profile/vap-svc/constants/countries.json';
import ADDRESS_DATA from './data';

const STATE_NAMES = ADDRESS_DATA.states;

/**
 * Accepts a country code in ISO3 format and returns the corresponding country object
 * @param {string} countryCodeIso3
 * @returns {object | null} The country object or null if no match is found
 */
export const getCountryObjectFromIso3 = countryCodeIso3 => {
  return (
    countries.find(country => country.countryCodeISO3 === countryCodeIso3) ||
    null
  );
};

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
  military: 'OVERSEAS MILITARY',
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
 */

/**
 * Returns whether or not the address is considered empty
 * @param {Address} address
 * @returns {boolean}
 */
export function isEmptyAddress(address) {
  const ignore = ['addressType', 'countryName', 'addressEffectiveDate'];

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
export function getStateName(abbreviation) {
  if (!abbreviation) {
    return abbreviation;
  }
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
    addressLine2,
    addressLine3,
    addressType,
    city,
    countryCodeIso3,
    countryName,
    internationalPostalCode,
    province,
    stateCode,
    zipCode,
  } = address || {};

  let cityStateZip = '';

  const displayCountry = countries.find(
    country => country.countryCodeISO3 === countryCodeIso3,
  );

  const displayCountryName = displayCountry?.countryName;

  // Only show country when ADDRESS_TYPES.international
  const country =
    addressType === ADDRESS_TYPES.international
      ? countryName || displayCountryName
      : '';

  const street =
    [addressLine1, addressLine2, addressLine3]
      .filter(item => item)
      .join(', ') || '';

  // only use the full state name for military addresses, otherwise just show
  // the two-letter state code
  let stateName = stateCode;
  if (addressType === ADDRESS_TYPES.military) {
    stateName = getStateName(stateCode);
  }

  switch (addressType) {
    case ADDRESS_TYPES.domestic:
    case ADDRESS_TYPES.military:
      cityStateZip = city || '';
      if (city && stateCode) cityStateZip += ', ';
      if (stateCode) cityStateZip += stateName;
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
      cityStateZip = address?.city || '';
  }

  return { street, cityStateZip, country };
}
