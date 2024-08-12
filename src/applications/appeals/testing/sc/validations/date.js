import { startOfToday, subYears, isBefore } from 'date-fns';

import { errorMessages } from '../constants';
import sharedErrorMessages from '../../../shared/content/errorMessages';
import { MAX_YEARS_PAST } from '../../../shared/constants';
import {
  createScreenReaderErrorMsg,
  createDateObject,
} from '../../../shared/validations/date';

// substract max years in the past
export const minDate = subYears(startOfToday(), MAX_YEARS_PAST);

export const validateDate = (errors, rawDateString = '', fullData) => {
  const date = createDateObject(rawDateString);
  const error =
    (fullData?.dateType || 'decisions') === 'decisions'
      ? sharedErrorMessages.decisions
      : errorMessages.evidence;

  if (date.isInvalid) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(error.blankDate);
    date.errors.other = true; // other part error
  } else if (date.hasErrors) {
    errors.addError(sharedErrorMessages.invalidDate);
    date.errors.other = true; // other part error
  } else if (date.isTodayOrInFuture) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(error.pastDate);
    date.errors.year = true; // only the year is invalid at this point
  } else if (isBefore(date.dateObj, minDate)) {
    errors.addError(error.newerDate);
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
