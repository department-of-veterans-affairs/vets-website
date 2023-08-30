import moment from 'moment';

import { issueErrorMessages } from '../content/addIssue';
import {
  createScreenReaderErrorMsg,
  dateFunctions,
  dateErrorMsgs,
} from '../../shared/validations/date';

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

export const validateDate = (errors, rawString = '') => {
  const {
    datePartErrors,
    isInvalidDateString,
    hasErrorDate,
    date,
    todayOrFutureDate,
  } = dateFunctions(rawString);

  // if (isInvalidDateString) {
  //   // The va-date component currently overrides the error message when the
  //   // value is blank
  //   errors.addError(issueErrorMessages.missingDecisionDate);
  //   datePartErrors.other = true; // other part error
  const hasMessages = dateErrorMsgs(
    errors,
    issueErrorMessages,
    datePartErrors,
    isInvalidDateString,
    hasErrorDate,
    todayOrFutureDate,
  );

  if (!hasMessages && date.isBefore(minDate)) {
    errors.addError(issueErrorMessages.newerDate);
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
