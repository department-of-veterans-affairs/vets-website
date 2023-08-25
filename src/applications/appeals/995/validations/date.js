import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { fixDateFormat } from '../../shared/utils/replace';
import { errorMessages, FORMAT_YMD, MAX_YEARS_PAST } from '../constants';

import {
  buildErrorParts,
  createPartsError,
  isInvalidDateString,
  hasErrorParts,
} from '../../shared/validations/date';

export const minDate = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, rawString = '', fullData) => {
  const dateString = fixDateFormat(rawString);
  const { day, month, year } = parseISODate(dateString);
  const date = moment(rawString, FORMAT_YMD);
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const maxDays = year && month ? new Date(year, month, 0).getDate() : 31;
  const dateType = fullData?.dateType || 'decisions';
  const invalidDate = dateString?.length < FORMAT_YMD.length || !date.isValid();
  const errorParts = buildErrorParts(month, day, year, maxDays);

  if (isInvalidDateString(year, day, month, invalidDate)) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(errorMessages[dateType].missingDate);
    errorParts.other = true; // other part error
  } else if (hasErrorParts(errorParts) || invalidDate) {
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
