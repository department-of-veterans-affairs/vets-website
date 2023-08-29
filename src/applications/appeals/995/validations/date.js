import moment from 'moment';

import { errorMessages, MAX_YEARS_PAST } from '../constants';

import { createPartsError, foo } from '../../shared/validations/date';

export const minDate = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, rawString = '', fullData) => {
  const { errorParts, isInvalidDateString, hasErrorDate, date } = foo(
    rawString,
  );
  const dateType = fullData?.dateType || 'decisions';

  if (isInvalidDateString) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(errorMessages[dateType].missingDate);
    errorParts.other = true; // other part error
  } else if (hasErrorDate) {
    errors.addError(errorMessages.invalidDate);
    errorParts.other = true; // other part error
  } else if (date.isSameOrAfter(maxDate)) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(errorMessages[dateType].pastDate);
    errorParts.year = true; // only the year is invalid at this point
  } else if (date.isBefore(minDate)) {
    errors.addError(errorMessages[dateType].newerDate);
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
