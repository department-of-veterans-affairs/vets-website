import { isBefore, isFuture, isToday, startOfToday, subYears } from 'date-fns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';
import { errorMessages } from '../constants';
import sharedErrorMessages from '../../shared/content/errorMessages';
import { MAX_YEARS_PAST } from '../../shared/constants';
import {
  createScreenReaderErrorMsg,
  createDateObject,
} from '../../shared/validations/date';

// subtract max years in the past
export const minDate = subYears(startOfToday(), MAX_YEARS_PAST);

/**
 * Validate evidence (treatment) dates
 * @param {*} errors
 * @param {*} rawDateString
 */
export const validateDate = (errors, rawDateString = '') => {
  const date = createDateObject(rawDateString);

  if (date.isInvalid || date.hasErrors) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(sharedErrorMessages.invalidDate);
    date.errors.other = true; // other part error
  } else if (isToday(date.dateObj) || isFuture(date.dateObj)) {
    errors.addError(errorMessages.evidence.pastDate);
    date.errors.year = true; // only the year is invalid at this point
  } else if (isBefore(date.dateObj, minDate)) {
    errors.addError(errorMessages.evidence.newerDate);
    date.errors.year = true; // only the year is invalid at this point
  }

  // add second error message containing the part of the date with an error;
  // used to add `aria-invalid` to the specific input
  createScreenReaderErrorMsg(errors, date.errors);
};

export const validateToDate = (errors, data, evidenceOrTreatmentDates) => {
  const dates = data[evidenceOrTreatmentDates] || {};
  validateDate(errors, dates?.to);

  // modified from validateDateRange
  const fromDate = convertToDateField(dates?.from);
  const toDate = convertToDateField(dates?.to);

  if (!isValidDateRange(fromDate, toDate, true)) {
    errors.addError(sharedErrorMessages.endDateBeforeStart);
    errors.addError('other'); // invalid inputs
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
  } else if (isToday(date.dateObj) || isFuture(date.dateObj)) {
    errors.addError(error.pastDate);
  } else if (isBefore(date.dateObj, minDate)) {
    errors.addError(error.newerDate);
  }
};
