import { startOfToday, subYears, isBefore } from 'date-fns';

import { errorMessages } from '../constants';
import sharedErrorMessages from '../../shared/content/errorMessages';
import { MAX_YEARS_PAST } from '../../shared/constants';
import {
  createScreenReaderErrorMsg,
  createDateObject,
  createDecisionDateErrorMsg,
} from '../../shared/validations/date';

// subtract max years in the past
export const minDate = subYears(startOfToday(), MAX_YEARS_PAST);

export const validateDate = (errors, rawDateString = '', fullData) => {
  console.log('fullData: ', fullData);
  const date = createDateObject(rawDateString);
  const isDecisionDateType =
    (fullData?.dateType || 'decisions') === 'decisions';
  const error = isDecisionDateType
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
    if (isDecisionDateType) {
      // Decision dates: Show dynamic cutoff date
      // (e.g., "The date must be before Dec. 10, 2025.")
      const decisionDateErrorMessage = createDecisionDateErrorMsg(
        sharedErrorMessages,
      );

      errors.addError(decisionDateErrorMessage);
    } else {
      // Evidence dates: Use static message
      errors.addError(errorMessages.evidence.pastDate);
    }
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

export const validateYMDate = (errors, rawDateString = '') => {
  if (!rawDateString || rawDateString.length < 7) {
    return; // VA date is not required
  }

  // Add "-01" (day) to the YYYY-MM date for processing
  const date = createDateObject(`${rawDateString}-01`);
  const error = errorMessages.evidence;

  if (date.isInvalid) {
    errors.addError(error.blankDate);
  } else if (date.hasErrors) {
    errors.addError(sharedErrorMessages.invalidDate);
  } else if (date.isTodayOrInFuture) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(error.pastDate);
  } else if (isBefore(date.dateObj, minDate)) {
    errors.addError(error.newerDate);
  }
};
