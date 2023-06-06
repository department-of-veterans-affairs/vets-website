import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { fixDateFormat } from '../utils/replace';
import { errorMessages, FORMAT_YMD, MAX_YEARS_PAST } from '../constants';

export const minDate = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, rawString = '', fullData) => {
  const dateString = fixDateFormat(rawString);
  const { day, month, year } = parseISODate(dateString);
  const date = moment(rawString, FORMAT_YMD);
  const dateType = fullData?.dateType || 'decisions';

  if (
    !year ||
    year === '' ||
    !day ||
    day === '0' ||
    !month ||
    month === '0' ||
    dateString?.length < FORMAT_YMD.length
  ) {
    // The va-memorable-date component currently overrides the error message
    // when the value is blank
    errors.addError(errorMessages[dateType].missingDate);
  } else if (!date.isValid()) {
    errors.addError(errorMessages.invalidDate);
  } else if (date.isSameOrAfter(maxDate)) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(errorMessages[dateType].pastDate);
  } else if (date.isBefore(minDate)) {
    errors.addError(errorMessages[dateType].newerDate);
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
