import stateNames from '../constants/states.json';
import militaryStatesJson from '../constants/military-states.json';

const MILITARY_STATES = new Set(militaryStatesJson);

/**
* @typedef {string} AddressType
*/

/**
* @readonly
* @enum {AddressType}
*/
const ADDRESS_TYPES = {
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  military: 'MILITARY'
};

/**
 * @typedef {object} Address
 * @property {AddressType} type
 * @property {string} countryName
 * @property {string} [addressOne]
 * @property {string} [addressTwo]
 * @property {string} [addressThree]
 * @property {string} [addressEffectiveAt]
 * @property {string} [city]
 * @property {string} [stateCode]
 * @property {string} [zipCode]
 * @property {string} [zipSuffix]
 * @property {string} [militaryPostOfficeTypeCode]
 * @property {string} [militaryStateCode]
 */

/**
 * Converts an address of type "military" to a standard format
 * @param {Address} address
 */
function convertMilitaryToStandard(address) {
  /* eslint-disable no-param-reassign */
  address.city = address.militaryPostOfficeTypeCode;
  address.stateCode = address.militaryStateCode;
  address.countryName = 'USA';
  delete address.militaryPostOfficeTypeCode;
  delete address.militaryStateCode;
}

/**
 * Converts an address into a standardized format so that military address follow the same interface as other address types.
 * @param {Address} address
 * @returns {Address}
 */

function consolidateAddress(address) {
  const consolidated = {
    ...address
  };

  if (consolidated.type === ADDRESS_TYPES.military) {
    convertMilitaryToStandard(consolidated);
  }

  delete consolidated.addressEffectiveDate;
  return consolidated;
}

/**
 * @param {Address} address
 * @returns {AddressType}
 */
function getInferredAddressType(address) {
  if (address.countryName !== 'USA') return ADDRESS_TYPES.international;
  if (MILITARY_STATES.has(address.stateCode)) return ADDRESS_TYPES.military;
  return ADDRESS_TYPES.domestic;
}

/**
 * Converts an address containing standard properties into a military address
 * @param {*} address
 */
function convertStandardToMilitary(address) {
  /* eslint-disable no-param-reassign */
  address.militaryPostOfficeTypeCode = address.city;
  address.militaryStateCode = address.stateCode;
  delete address.city;
  delete address.stateCode;
  delete address.countryName;
}

/**
 * Converts an address that may have been modified or standardized and needs its type to be inferred
 * @param {Address} address
 * @returns {Address}
 */
function expandAddress(address) {
  const expanded = {
    ...address,
    type: getInferredAddressType(address)
  };

  if (expanded.type === ADDRESS_TYPES.military) {
    convertStandardToMilitary(expanded);
  }

  return expanded;
}

function isEmptyAddress(address) {
  // @todo
}

function getStateName(abbreviation) {
  return stateNames[abbreviation];
}

export { ADDRESS_TYPES, consolidateAddress, expandAddress, getStateName };
