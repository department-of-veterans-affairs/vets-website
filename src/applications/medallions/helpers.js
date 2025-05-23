import moment from 'moment';

import { isValidSSN } from 'platform/forms-system/src/js/utilities/validations';

export function dateOfDeathValidation(errors, fields) {
  const { veteranDateOfBirth, veteranDateOfDeath } = fields;
  // dob = date of birth | dod = date of death
  const dob = moment(veteranDateOfBirth);
  const dod = moment(veteranDateOfDeath);

  // Check if the dates entered are after the date of birth
  if (dod.isBefore(dob)) {
    errors.veteranDateOfDeath.addError(
      'The Veteran’s date of death must be after the Veteran’s date of birth.',
    );
  }

  // Check if dates have 16 or more years between them
  if (dod.diff(dob, 'years') < 16) {
    errors.veteranDateOfDeath.addError(
      'From date of birth to date of death must be at least 16 years.',
    );
  }
}

export function validateSSN(errors, ssn) {
  if (ssn && !isValidSSN(ssn)) {
    errors.addError(
      'Please enter a valid 9 digit Social Security number (dashes allowed)',
    );
  }
}
