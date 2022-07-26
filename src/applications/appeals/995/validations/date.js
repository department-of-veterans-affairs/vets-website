import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';

import { FORMAT_YMD } from '../constants';

import { issueErrorMessages } from '../content/addIssue';

export const oneYearAgo = moment()
  .subtract(1, 'year')
  .startOf('day');

const today = moment().startOf('day');

export const validateDate = (
  errors,
  dateString,
  _form,
  _schema,
  _errorMessages,
  { min, max }, // alter min & max dates
) => {
  const { day, month, year } = parseISODate(dateString);
  const date = moment(dateString, FORMAT_YMD);
  const minDate = min ? moment(min, FORMAT_YMD) : oneYearAgo;
  const maxDate = max ? moment(max, FORMAT_YMD) : today;

  if (
    dateString === 'XXXX-XX-XX' ||
    dateString === '' ||
    dateString?.length < FORMAT_YMD.length
  ) {
    // errors.addError(issueErrorMessages.missingDecisionDate);
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(issueErrorMessages.invalidDate);
  } else if (!day || day === 'XX' || !month || month === 'XX') {
    errors.addError(issueErrorMessages.invalidDate);
  } else if (year?.length >= 4 && !isValidYear(year)) {
    errors.addError(
      issueErrorMessages.invalidDateRange(minDate.year(), maxDate.year()),
    );
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
