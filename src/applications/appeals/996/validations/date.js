import moment from 'moment';

import { issueErrorMessages } from '../content/addIssue';
import { createPartsError, foo } from '../../shared/validations/date';

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, rawString = '') => {
  const { errorParts, isInvalidDateString, hasErrorDate, date } = foo(
    rawString,
  );

  if (isInvalidDateString) {
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(issueErrorMessages.missingDecisionDate);
    errorParts.other = true; // other part error
  } else if (hasErrorDate) {
    errors.addError(issueErrorMessages.invalidDate);
    errorParts.other = true; // other part error
  } else if (date.isSameOrAfter(maxDate)) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(issueErrorMessages.pastDate);
    errorParts.year = true; // only the year is invalid at this point
  } else if (date.isBefore(minDate)) {
    errors.addError(issueErrorMessages.newerDate);
    errorParts.year = true; // only the year is invalid at this point
  }

  // add second error message containing the part of the date with an error;
  // used to add `aria-invalid` to the specific input
  const partsError = createPartsError(errorParts);
  if (partsError) {
    errors.addError(partsError);
  }
};

/**
 * Use above validation to set initial edit state
 */
export const isValidDate = dateString => {
  let isValid = true;
  const errors = {
    addError: () => {
      isValid = false;
    },
  };
  validateDate(errors, dateString);
  return isValid;
};
