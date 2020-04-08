import _ from 'platform/utilities/data';
import get from 'platform/utilities/data/get';
import { militaryCities, militaryStates } from '../constants';

/**
 * Returns the path with any ':index' substituted with the actual index.
 * @param {string} path - The path with or without ':index'
 * @param {number} index - The index to put in the string
 * @return {string}
 */

export const pathWithIndex = (path, index) => path.replace(':index', index);

// Validation functions

export function validateMilitaryCity(
  errors,
  city,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) {
  const isMilitaryState = militaryStates.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = militaryCities.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}
export function validateMilitaryState(
  errors,
  state,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) {
  const isMilitaryCity = militaryCities.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = militaryStates.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}
export function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}
export function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError(
      'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    );
  }
}

export const newAddressHider = formData => {
  const address = get('newAddress', formData);
  // return true if living at view:militaryBaseInfo object
  return Object.keys(address).every(entry => {
    const value = address[entry] || '';
    return typeof value === 'string' ? value === '' : true;
  });
};

export const updateRadioLabels = (formData, name) => {
  const address = get(name, formData) || {};
  const { street, street2, city, country, state, postalCode } = address;
  const updatedLabel = `${street} ${street2 ||
    ''} ${city} ${state} ${country} ${postalCode}`;
  return updatedLabel;
};
