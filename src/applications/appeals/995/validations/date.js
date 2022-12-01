import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';

import { errorMessages, FORMAT_YMD, MAX_YEARS_PAST } from '../constants';

export const minDate = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, dateString, fullData) => {
  const { day, month, year } = parseISODate(dateString);
  const date = moment(dateString, FORMAT_YMD);
  const dateType = fullData?.dateType || 'decisions';

  if (
    dateString === 'XXXX-XX-XX' ||
    dateString === '' ||
    dateString?.length < FORMAT_YMD.length
  ) {
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(errorMessages.invalidDate);
  } else if (!day || day === 'XX' || !month || month === 'XX') {
    errors.addError(errorMessages.invalidDate);
  } else if (year?.length >= 4 && !isValidYear(year)) {
    errors.addError(
      errorMessages.invalidDateRange(minDate.year(), maxDate.year()),
    );
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
