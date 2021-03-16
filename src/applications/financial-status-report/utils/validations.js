import _ from 'platform/utilities/data';
import { MILITARY_CITY_CODES, MILITARY_STATE_CODES } from '../constants';

export const pathWithIndex = (path, index) => path.replace(':index', index);

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

export function validateMilitaryCity(
  errors,
  city,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) {
  const isMilitaryState = MILITARY_STATE_CODES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = MILITARY_CITY_CODES.includes(
    city.trim().toUpperCase(),
  );
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
  const isMilitaryCity = MILITARY_CITY_CODES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_CODES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}
