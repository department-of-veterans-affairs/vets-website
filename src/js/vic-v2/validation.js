import { getFileError } from '../common/schemaform/validation';
import {
  isValidUSZipCode,
  isValidCanPostalCode,
} from '../common/utils/validations';

export default function validateFile(errors, file) {
  const error = getFileError(file);

  if (error && !errors) {
    /* eslint-disable no-param-reassign */
    errors = {
      __errors: [],
      addError(msg) {
        this.__errors.push(msg);
      }
    };
    /* eslint-enable no-param-reassign */
  }

  if (error) {
    errors.addError(error);
  }
}

export function validateAddress(errors, address) {
  let isValidPostalCode = true;

  // Checks if postal code is valid
  if (address.country === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidUSZipCode(address.postalCode);
  }
  if (address.country === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidCanPostalCode(address.postalCode);
  }

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}
