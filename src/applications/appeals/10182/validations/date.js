import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { fixDateFormat } from '../utils/replace';
import { FORMAT_YMD } from '../constants';

import { issueErrorMessages } from '../content/addIssue';

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, rawString = '') => {
  const dateString = fixDateFormat(rawString);
  const { day, month, year } = parseISODate(dateString);
  const date = moment(rawString, FORMAT_YMD);
  if (
    !year ||
    year === '' ||
    !day ||
    day === '0' ||
    !month ||
    month === '0' ||
    dateString?.length < FORMAT_YMD.length
  ) {
    // errors.addError(issueErrorMessages.missingDecisionDate);
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(issueErrorMessages.invalidDate);
  } else if (!date.isValid()) {
    errors.addError(issueErrorMessages.invalidDate);
  } else if (date.isSameOrAfter(maxDate)) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(issueErrorMessages.pastDate);
  } else if (date.isBefore(minDate)) {
    errors.addError(issueErrorMessages.newerDate);
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
