import { isBefore, startOfDay, subYears } from 'date-fns';

import errorMessages from '../../shared/content/errorMessages';
import { MAX_YEARS_PAST } from '../../shared/constants';
import {
  createScreenReaderErrorMsg,
  addDateErrorMessages,
  createDateObject,
} from '../../shared/validations/date';

const minDate100 = startOfDay(subYears(new Date(), MAX_YEARS_PAST));

export const validateDate = (errors, rawDateString = '') => {
  const date = createDateObject(rawDateString);
  const hasMessages = addDateErrorMessages(errors, errorMessages, date);

  if (!hasMessages && isBefore(date.dateObj, minDate100)) {
    // max 100 years for newer form
    errors.addError(errorMessages.decisions.newerDate);
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
