import { isValidCentralMailPostalCode } from 'platform/forms/address/validations';

export function validateCentralMailPostalCode(errors, address) {
  if (!isValidCentralMailPostalCode(address)) {
    errors.postalCode.addError(
      'Please enter a valid postal code (e.g. 12345 or 12345-6789)',
    );
  }
}
