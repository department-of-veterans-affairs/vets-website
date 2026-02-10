import {
  isFuture,
  isToday,
  isValid,
  isBefore,
  startOfDay,
  subYears,
} from 'date-fns';
import { parseISODate } from '~/platform/forms-system/src/js/helpers';
import sharedErrorMessages from '../content/errorMessages';
import { FORMAT_YMD_DATE_FNS, MAX_YEARS_PAST } from '../constants';
import {
  fixDateFormat,
  formatDateWithTime,
  isUTCFuture,
  isUTCToday,
  parseDateToDateObj,
} from '../utils/dates';

/**
 * Primary criteria for whether a contestable issue decision date should be blocked
 * from appeal submission. Uses dual validation approach combining local timezone
 * and UTC validation.
 *
 * We don't allow submission for any of the following scenarios until a certain date:
 * 1. If decision date is same as current local calendar day
 * 2. If decision date is the same UTC calendar day
 * 3. If decision date is in the future (either local or UTC)
 *
 * @param {Date} date - The date to check
 * @returns {Obj} - Booleans for determining blocking criteria
 */
export const isTodayOrInFuture = date => {
  if (!date || !isValid(date)) return false;

  const blockingCriteria = {
    isTodayLocal: isToday(date), // Decision date = local day
    isFutureLocal: isFuture(date), // Decision date after current local day
    isTodayUtc: isUTCToday(date), // Decision date = UTC day
    isFutureUtc: isUTCFuture(date), // Decision date after current UTC day
  };

  return Object.values(blockingCriteria).some(value => value);
};

const buildDatePartErrors = (month, day, year) => {
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const maxDaysInAMonth =
    year && month ? new Date(year, month, 0).getDate() : 31;
  return {
    month: !month || month < 1 || month > 12,
    day: !day || day < 1 || day > maxDaysInAMonth,
    year: !year,
    other: false, // catch all for partial & invalid dates
  };
};

const isInvalidDateString = (year, day, month, dateString) => {
  return (
    !year ||
    isNaN(year) ||
    // minimum year is 1900; no need to check if year === '0'
    !day ||
    isNaN(day) ||
    day === '0' ||
    !month ||
    isNaN(month) ||
    month === '0' ||
    dateString?.length < FORMAT_YMD_DATE_FNS.length
  );
};

export const createDateObject = rawDateString => {
  const dateString = fixDateFormat(rawDateString);
  const { day, month, year } = parseISODate(dateString);
  const dateObj = parseDateToDateObj(rawDateString, FORMAT_YMD_DATE_FNS);
  const invalidDate =
    dateString?.length < FORMAT_YMD_DATE_FNS.length || !isValid(dateObj);
  const datePartErrors = buildDatePartErrors(month, day, year);

  return {
    errors: datePartErrors,
    isInvalid: isInvalidDateString(year, day, month, dateString),
    hasErrors:
      datePartErrors.month ||
      datePartErrors.day ||
      datePartErrors.year ||
      invalidDate,
    dateObj,
  };
};

/**
 * Calculate when a blocked contestable issue decision date becomes eligible for submission
 * See README-decision-date-validation.md for business rules & detailed examples
 *
 * @param {Date} decisionDate - The decision date in user's local timezone
 * @returns {string} Formatted date/time when issue becomes eligible (e.g., "Jan. 10, 2026 at 10 a.m. JST")
 */
export const getAvailableDateTimeForBlockedIssue = decisionDate => {
  const aheadOfUtc = new Date().getTimezoneOffset() < 0;

  const decisionYear = decisionDate.getFullYear();
  const decisionMonth = decisionDate.getMonth();
  const decisionDay = decisionDate.getDate();

  let availableDateTime;

  if (!aheadOfUtc) {
    availableDateTime = new Date(
      decisionYear,
      decisionMonth,
      decisionDay + 1,
      0,
      0,
      0,
      0,
    );
  } else {
    // Users ahead of UTC: UTC midnight of next day (will display in local time)
    availableDateTime = new Date(
      Date.UTC(decisionYear, decisionMonth, decisionDay + 1, 0, 0, 0, 0),
    );
  }

  return formatDateWithTime(availableDateTime);
};

export const addBlockedMessage = (date, errors) => {
  const availableDateTime = getAvailableDateTimeForBlockedIssue(date.dateObj);

  const errorMessage = sharedErrorMessages.decisions.dateUnavailable(
    availableDateTime,
  );

  errors.addError(errorMessage);
};

// add second error message containing the part of the date with an error;
// used to add `aria-invalid` to the specific input
export const createScreenReaderErrorMsg = (errors, datePartErrors) => {
  const partialDateError = Object.entries(datePartErrors).reduce(
    (result, [partName, hasError]) => result + (hasError ? `${partName} ` : ''),
    '',
  );
  if (partialDateError) {
    errors.addError(partialDateError);
  }
};

// We have to pass unused args to this function because the checkValidation function
// accommodates other functions with args of varying length
export const validateDecisionDate = (
  errors,
  rawDateString = '',
  fullData,
  _schema,
  _uiSchema,
  index,
  appStateData,
  appAbbr,
) => {
  const date = createDateObject(rawDateString);
  let hasMessages = false;
  const isBlocked = isTodayOrInFuture(date.dateObj);

  if (isBlocked) {
    addBlockedMessage(date, errors);
  }

  const minDate100 = startOfDay(subYears(new Date(), MAX_YEARS_PAST));
  const minDateOneYear = startOfDay(subYears(new Date(), 1)); // For HLR only

  if (date.isInvalid) {
    errors.addError(sharedErrorMessages.decisions.blankDate);
    // eslint-disable-next-line no-param-reassign
    date.errors.other = true; // other part error
    hasMessages = true;
  }

  if (date.hasErrors) {
    errors.addError(sharedErrorMessages.invalidDate);
    // eslint-disable-next-line no-param-reassign
    date.errors.other = true; // other part error
    hasMessages = true;
  }

  // HLR manually entered issues' decision dates can be at most a year old
  if (
    appAbbr === 'HLR' &&
    !hasMessages &&
    isBefore(date.dateObj, minDateOneYear)
  ) {
    errors.addError(sharedErrorMessages.decisions.recentDate);
    date.errors.year = true; // only the year is invalid at this point
  }

  // Any flow's decision date can be at most 100 years old
  if (!hasMessages && isBefore(date.dateObj, minDate100)) {
    errors.addError(sharedErrorMessages.decisions.newerDate);
    date.errors.year = true; // only the year is invalid at this point
  }

  // add second error message containing the part of the date with an error;
  // used to add `aria-invalid` to the specific input
  createScreenReaderErrorMsg(errors, date.errors);
};
