import { startOfToday, subYears, isBefore } from 'date-fns';

import { errorMessages } from '../constants';
import { MAX_YEARS_PAST } from '../../shared/constants';
import {
  createScreenReaderErrorMsg,
  createDateObject,
} from '../../shared/validations/date';

// substract max years in the past
export const minDate = subYears(startOfToday(), MAX_YEARS_PAST);

export const validateDate = (errors, rawDateString = '', fullData) => {
  const date = createDateObject(rawDateString);
  const dateType = fullData?.dateType || 'decisions';

  if (date.isInvalid) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(errorMessages[dateType].blankDate);
    date.errors.other = true; // other part error
  } else if (date.hasErrors) {
    errors.addError(errorMessages.invalidDate);
    date.errors.other = true; // other part error
  } else if (date.isTodayOrInFuture) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(errorMessages[dateType].pastDate);
    date.errors.year = true; // only the year is invalid at this point
  } else if (isBefore(date.dateObj, minDate)) {
    errors.addError(errorMessages[dateType].newerDate);
    date.errors.year = true; // only the year is invalid at this point
  }

  // add second error message containing the part of the date with an error;
  // used to add `aria-invalid` to the specific input
  createScreenReaderErrorMsg(errors, date.errors);
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
