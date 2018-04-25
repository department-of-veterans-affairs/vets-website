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
 * Converts an address into a standardized format so that military address follow the same interface as other address types.
 * @param {Address} address
 * @returns {Address}
 */
function consolidateAddress(address) {
  const consolidated = {
    ...address
  };

  if (consolidated.type === ADDRESS_TYPES.military) {
    consolidated.city = consolidated.militaryPostOfficeTypeCode;
    consolidated.stateCode = consolidated.militaryStateCode;
    consolidated.countryName = 'USA';
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
  if (address.countryName !== 'USA') return ADDRESS_TYPES.international;
  if (MILITARY_STATES.has(address.stateCode)) return ADDRESS_TYPES.military;
  return ADDRESS_TYPES.domestic;
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
function isEmptyAddress(address) {
  const ignore = ['type', 'countryName'];
  return Object.keys(address)
    .filter(prop => !ignore.includes(prop))
    .every(prop => !address[prop]);
}

function getStateName(abbreviation) {
  return stateNames[abbreviation];
}

export { ADDRESS_TYPES, consolidateAddress, expandAddress, getStateName, isEmptyAddress };
