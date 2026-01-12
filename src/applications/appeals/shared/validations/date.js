import {
  add,
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
  formatDateToReadableString,
  getCurrentUTCStartOfDay,
  getUTCDateFromDate,
  isUTCFuture,
  isUTCToday,
  parseDateToDateObj,
} from '../utils/dates';

/**
 * Main validation method: Check if a date should be blocked from appeal submission
 * Uses dual validation approach combining local timezone and UTC validation
 * This prevents same-day submissions globally while maintaining backend consistency
 *
 * We don't allow submission for any of the following scenarios until a certain date:
 * 1. If decision date is same as current local calendar day
 * 2. If decision date is the same UTC calendar day
 * 3. If decision date is in the future (either local or UTC)
 *
 * @param {Date} date - The date to check
 * @returns {Obj} - Booleans to compare where local time/date is vs. UTC time/date
 */
export const isTodayOrInFuture = date => {
  if (!date || !isValid(date)) return false;

  // Determine whether local timezone is ahead or behind UTC
  // Negative values are ahead of UTC
  const timezoneOffset = new Date().getTimezoneOffset();

  return {
    isTodayLocal: isToday(date),
    isFutureLocal: isFuture(date),
    isTodayUtc: isUTCToday(date),
    isFutureUtc: isUTCFuture(date),
    aheadOfUtc: timezoneOffset < 0,
  };
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
 * Create dynamic error message for decision dates that are blocked
 * Always show "The date must be before [cutoff day expressed in the user's local timezone]"
 *
 * The cutoff date may not be the user's local current day
 * If they are behind UTC time, the cutoff date will be based on local time
 * If they are ahead of UTC time, the cutoff date will be based on UTC time
 *
 * Whichever is the case, contestable issues cannot be selected on the same day as the
 * given decision date in local time or UTC (server) time, whichever is sooner.
 * The decision date must be in the past for local time, if sooner, or UTC time if later
 *
 * This tells users the earliest acceptable date that will pass validation globally
 * @param {Object} errorMessages - Error messages object containing decisions.pastDate function
 * @returns {string} Formatted error message showing UTC today as calendar date
 */
export const createDecisionDateErrorMsg = errorMessages => {
  const now = new Date();

  const utcTodayAsLocalDate = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0,
  );

  const cutoffDate = formatDateToReadableString(utcTodayAsLocalDate);

  return errorMessages.decisions.pastDate(cutoffDate);
};

// Check out README-decision-date-validation.md for detailed explanation of this logic
export const determineIfDateBlocksSubmission = (
  errors,
  errorMessages,
  date,
  hasMessages,
) => {
  const blockingCriteria = isTodayOrInFuture(date);

  console.log('blockingCriteria: ', blockingCriteria);

  if (blockingCriteria) {
    const {
      aheadOfUtc,
      isFutureLocal,
      isFutureUtc,
      isTodayLocal,
      isTodayUtc,
    } = blockingCriteria;

    const todayLocal = new Date();
    const todayUtc = getCurrentUTCStartOfDay();
    const tomorrowLocal = new Date(todayLocal).setDate(
      todayLocal.getDate() + 1,
    );

    let cutoffDate = todayLocal;

    if (isTodayLocal && !aheadOfUtc) {
      // ex: DD is 1/1/26, today is 1/1/26 local, local is behind UTC
      cutoffDate = todayLocal; // date must be before today local
    } else if (isTodayLocal && aheadOfUtc && isTodayUtc) {
      // ex: DD is 1/1/26, today is 1/1/26 local, local is ahead of UTC, today is 1/1/26 UTC
      cutoffDate = todayUtc; // date must be before today UTC
    } else if (isTodayLocal && aheadOfUtc && isFutureUtc) {
      // ex: DD is 1/2/26, today is 1/2/26 local, local is ahead of UTC, today is 1/1/26 UTC
      cutoffDate = todayUtc; // date must be before today UTC
    } else if (isFutureLocal && !aheadOfUtc) {
      // ex: DD is 1/2/26, today is 1/1/26 local, local is behind UTC
      cutoffDate = todayLocal; // date must be before today local
    } else if (isFutureLocal && aheadOfUtc && isTodayUtc) {
      // ex: DD is 1/2/26, today is 1/1/26 local, local is ahead of UTC, today is 1/1/26 UTC
      cutoffDate = todayUtc; // date must be before today UTC
    }

    const decisionDateErrorMessage = createDecisionDateErrorMsg(errorMessages);

    errors.addError(decisionDateErrorMessage);
    // eslint-disable-next-line no-param-reassign
    date.errors.year = true; // only the year is invalid at this point
    return true;
  }

  return false;
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

  determineIfDateBlocksSubmission(
    errors,
    sharedErrorMessages,
    date.dateObj,
    hasMessages,
  );

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
