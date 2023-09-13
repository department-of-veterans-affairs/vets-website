import moment from 'moment';

import { errorMessages } from '../constants';
import { MAX_YEARS_PAST } from '../../shared/constants';
import {
  createScreenReaderErrorMsg,
  dateFunctions,
} from '../../shared/validations/date';

export const minDate = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

export const validateDate = (errors, rawDateString = '', fullData) => {
  const {
    datePartErrors,
    isInvalidDateString,
    hasDateErrors,
    date,
    todayOrFutureDate,
  } = dateFunctions(rawDateString);
  const dateType = fullData?.dateType || 'decisions';

  if (isInvalidDateString) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(errorMessages[dateType].blankDate);
    datePartErrors.other = true; // other part error
  } else if (hasDateErrors) {
    errors.addError(errorMessages.invalidDate);
    datePartErrors.other = true; // other part error
  } else if (todayOrFutureDate) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(errorMessages[dateType].pastDate);
    datePartErrors.year = true; // only the year is invalid at this point
  } else if (date.isBefore(minDate)) {
    errors.addError(errorMessages[dateType].newerDate);
    datePartErrors.year = true; // only the year is invalid at this point
  }

  // add second error message containing the part of the date with an error;
  // used to add `aria-invalid` to the specific input
  const partsError = createScreenReaderErrorMsg(datePartErrors);
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
