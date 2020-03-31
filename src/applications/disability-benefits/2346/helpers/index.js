import _ from 'platform/utilities/data';
import { MILITARY_CITIES, MILITARY_STATE_VALUES } from '../constants';

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
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
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
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
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
