import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { SHOW_PART3 } from '../constants';
import { issueErrorMessages } from '../content/addIssue';

import { fixDateFormat } from '../../shared/utils/replace';
import { FORMAT_YMD, MAX_YEARS_PAST } from '../../shared/constants';
import {
  buildErrorParts,
  createPartsError,
  isInvalidDateString,
  hasErrorParts,
} from '../../shared/validations/date';

const minDate1 = moment()
  .subtract(1, 'year')
  .startOf('day');

const minDate100 = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (
  errors,
  rawString = '',
  formData = {},
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  const data = Object.keys(appStateData || {}).length ? appStateData : formData;
  const dateString = fixDateFormat(rawString);
  const { day, month, year } = parseISODate(dateString);
  const date = moment(rawString, FORMAT_YMD);
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const maxDays = year && month ? new Date(year, month, 0).getDate() : 31;
  const invalidDate = dateString?.length < FORMAT_YMD.length || !date.isValid();
  const errorParts = buildErrorParts(month, day, year, maxDays);

  if (isInvalidDateString(year, day, month, invalidDate)) {
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(issueErrorMessages.missingDecisionDate);
    errorParts.other = true; // other part error
  } else if (hasErrorParts(errorParts, invalidDate)) {
    errors.addError(issueErrorMessages.invalidDate);
    errorParts.other = true; // other part error
  } else if (date.isSameOrAfter(maxDate)) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(issueErrorMessages.pastDate);
    errorParts.year = true; // only the year is invalid at this point
  } else if (!data[SHOW_PART3] && date.isBefore(minDate1)) {
    errors.addError(issueErrorMessages.newerDate);
    errorParts.year = true;
  } else if (date.isBefore(minDate100)) {
    // max 1 year for old form or 100 years for newer form
    errors.addError(issueErrorMessages.recentDate);
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
