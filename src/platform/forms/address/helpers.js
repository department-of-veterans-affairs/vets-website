import ADDRESS_DATA from './data';
import countries from '@@vap-svc/constants/countries.json';

const STATE_NAMES = ADDRESS_DATA.states;

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
 * @typedef FormatedAddress
 * @type {object}
 * @property {string} addressLine1 street address line 1
 * @property {string} addressLine2 street address line 2
 * @property {string} addressLine3 street address line 3
 * @property {string} city city name
 * @property {string} stateOrProvince undifferentiated name of state (domestic)
 *  or province (international)
 * @property {string} zipOrPostalCode undifferentiated zip or postal code
 * @property {string} street addressLine1, addressLine2 and addressLine3
 *  combined into a comma separated string
 * @property {string} cityStateZip city, stateOrProvince and zipOrPostalCode
 *  combined into a comma separated string
 * @property {string} country name of the country, or an empty string if it is
 *  a domestic U.S. address
 */
/**
 * Accepts any address and returns an object containing the fields formatted for display
 * @param {Address} address
 * @returns {FormatedAddress} Originally it returned an object containing
 *  properties for street, cityStateZip, and country. In an update, the returned
 *  object includes each street address line, undifferentiated stateOrProvice
 *  and undifferentiated zipOrPostalCode to custom formatted output
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
  } = address;

  const returnedAddress = {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
  };

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
      if (stateCode) {
        cityStateZip += stateName;
        returnedAddress.stateOrProvince = stateName;
      }
      if (zipCode) {
        cityStateZip += ' ' + zipCode;
        returnedAddress.zipOrPostalCode = zipCode;
      }
      break;

    // For international addresses we add a comma after the province
    case ADDRESS_TYPES.international:
      cityStateZip =
        [city, province, internationalPostalCode]
          .filter(item => item)
          .join(', ') || '';
      returnedAddress.stateOrProvince = province;
      returnedAddress.zipOrPostalCode = internationalPostalCode;
      break;

    default:
      cityStateZip = address.city;
  }

  return {
    ...returnedAddress,
    // combined address strings
    street,
    cityStateZip,
    country,
  };
}
