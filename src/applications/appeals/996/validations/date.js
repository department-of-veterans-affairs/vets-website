import moment from 'moment';

import { issueErrorMessages } from '../content/addIssue';
import {
  createScreenReaderErrorMsg,
  createDateObject,
  addDateErrorMessages,
} from '../../shared/validations/date';

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

export const validateDate = (errors, rawDateString = '') => {
  const date = createDateObject(rawDateString);

  const hasMessages = addDateErrorMessages(errors, issueErrorMessages, date);

  if (!hasMessages && date.momentDate.isBefore(minDate)) {
    errors.addError(issueErrorMessages.newerDate);
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
