import { isNotBlank, isValidUSZipCode } from '../../common/utils/validations';
// import { addressTypes } from './constants';

const requiredMessage = '';

/**
 * Ensures the input isn't blank
 */
const requiredValidator = (input, message) => {
  if (!input) {
    return message || requiredMessage;
  }

  // Could return anything that isn't a string, really
  return true;
};


/**
 * These validation functions must return an error message string if the validation fails.
 */
export const addressOneValidations = [
  requiredValidator
];

export const postalCodeValidations = [
  // Require zip for US address
  (postalCode, fullAddress) => {
    if (fullAddress.country === 'USA' && isNotBlank(postalCode)) {
      return requiredMessage;
    }

    return true;
  },
  // Check for valid US zip codes
  (postalCode, fullAddress) => {
    if (['US', 'USA'].includes(fullAddress.country) && !isValidUSZipCode(postalCode)) {
      return 'Please enter a valid zip code';
    }

    return true;
  }
];

export const stateValidations = [
  requiredValidator // May not be true if the country isn't USA
];

export const countryValidations = [
  requiredValidator
];

export const cityValidations = [
  requiredValidator
];

