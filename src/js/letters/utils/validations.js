import { isValidUSZipCode } from '../../common/utils/validations';

const requiredMessage = 'Please enter a valid address'; // Change me! 

/**
 * Ensures the input isn't blank
 */
const requiredValidator = (input, fullAddress, message) => {
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
  (input, fullAddress) => requiredValidator(input, fullAddress, 'Please enter an address')
];

export const postalCodeValidations = [
  // Require zip for US address
  (postalCode, fullAddress) => {
    if (fullAddress.country === 'USA' && !postalCode) {
      return 'Please enter a Zip code';
    }

    return true;
  },
  // Check for valid US zip codes
  (postalCode, fullAddress) => {
    if (['US', 'USA'].includes(fullAddress.country) && !isValidUSZipCode(postalCode)) {
      return 'Please enter a valid Zip code';
    }

    return true;
  }
];

export const stateValidations = [
  // May not be true if the country isn't USA
  (input, fullAddress) => requiredValidator(input, fullAddress, 'Please enter a state')
];

export const countryValidations = [
  (input, fullAddress) => requiredValidator(input, fullAddress, 'Please enter a country')
];

export const cityValidations = [
  (input, fullAddress) => requiredValidator(input, fullAddress, 'Please enter a city')
];

