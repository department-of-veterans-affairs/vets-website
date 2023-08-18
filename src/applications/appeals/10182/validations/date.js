import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { fixDateFormat } from '../utils/replace';
import { SHOW_PART3 } from '../constants';

import { issueErrorMessages } from '../content/addIssue';

import { FORMAT_YMD, MAX_YEARS_PAST } from '../../shared/constants';

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
  const errorParts = {
    month: !month || month < 1 || month > 12,
    day: !day || day < 1 || day > maxDays,
    year: !year,
    other: false, // catch all for partial & invalid dates
  };

  if (
    !year ||
    !day ||
    day === '0' ||
    !month ||
    month === '0' ||
    dateString?.length < FORMAT_YMD.length
  ) {
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(issueErrorMessages.missingDecisionDate);
    errorParts.other = true; // other part error
  } else if (
    errorParts.month ||
    errorParts.day ||
    errorParts.year ||
    invalidDate
  ) {
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
  const partsError = Object.entries(errorParts).reduce(
    (result, [partName, hasError]) => result + (hasError ? `${partName} ` : ''),
    '',
  );
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
