import _ from 'lodash/fp';
import { isValidDateRange } from '../../platform/forms/validations';
import { convertToDateField } from 'us-forms-system/lib/js/validation';
import { isValidCentralMailPostalCode } from '../../platform/forms/address/validations';

export function validateAfterMarriageDate(errors, dateOfSeparation, formData) {
  const fromDate = convertToDateField(formData.dateOfMarriage);
  const toDate = convertToDateField(dateOfSeparation);

  if (!isValidDateRange(fromDate, toDate)) {
    errors.addError('Date marriage ended must be after date of marriage');
  }
}

export function validateServiceBirthDates(errors, service, formData) {
  const fromDate = convertToDateField(formData.veteranDateOfBirth);
  const toDate = convertToDateField(
    _.get('activeServiceDateRange.from', service),
  );

  if (!isValidDateRange(fromDate, toDate)) {
    errors.activeServiceDateRange.from.addError(
      'Date entering active service should be after birth date',
    );
  }
}

export function validateCentralMailPostalCode(errors, address) {
  if (!isValidCentralMailPostalCode(address)) {
    errors.postalCode.addError(
      'Please enter a valid postal code (e.g. 12345 or 12345-6789)',
    );
  }
}
