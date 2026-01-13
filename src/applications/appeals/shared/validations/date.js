import {
  add,
  format,
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
  fromUTCToLocalDate,
  getCurrentUTCStartOfDay,
  getUTCDateFromDate,
  isUTCFuture,
  isUTCToday,
  parseDateToDateObj,
  toUTCStartOfDay,
} from '../utils/dates';
import { getCurrentTimeZoneAbbr } from '../utils/contestableIssueMessages';

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

  // Determine whether local timezone is ahead or behind UTC
  // Negative values are ahead of UTC
  const timezoneOffset = new Date().getTimezoneOffset();

  const blockingCriteria = {
    isTodayLocal: isToday(date), // Decision date = local day
    isFutureLocal: isFuture(date), // Decision date after current local day
    isTodayUtc: isUTCToday(date), // Decision date = UTC day
    isFutureUtc: isUTCFuture(date), // Decision date after current UTC day
  };

  if (Object.values(blockingCriteria).some(value => value)) {
    return {
      ...blockingCriteria,
      blocked: true,
      aheadOfUtc: timezoneOffset < 0, // Local time is later than UTC time (user is east of Greenwich)
    };
  }

  return {
    blocked: false,
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
 * @param {Object} errorMessages - Error messages object containing decisions.dateUnavailable function
 * @returns {string} Formatted error message showing UTC today as calendar date
 */
export const createDecisionDateErrorMsg = (errorMessages, availableDate) => {
  const formattedAvailableDate = formatDateToReadableString(availableDate);

  return errorMessages.decisions.dateUnavailable(formattedAvailableDate);
};

/**
 * Format a date to readable string with time and timezone
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string like "Jan. 10, 2026 at 12 a.m. AKST"
 */
export const formatUTCDateToLocalWithTime = date => {
  if (!date || !isValid(date)) return '';

  const hours = date.getHours();
  const period = hours >= 12 ? 'p.m.' : 'a.m.';
  const displayHours = hours % 12 || 12;
  const timezone = getCurrentTimeZoneAbbr();

  // Format: "Jan. 10, 2026"
  const dateStr = format(date, 'MMM. d, yyyy');

  return `${dateStr} at ${displayHours} ${period} ${timezone}`;
};

// Check out README-decision-date-validation.md for detailed explanation of this logic
export const getAvailableDateTimeForBlockedIssue = (blockingCriteria, date) => {
  const {
    aheadOfUtc,
    isFutureLocal,
    isFutureUtc,
    isTodayLocal,
    isTodayUtc,
  } = blockingCriteria;

  const todayLocal = new Date();
  const todayUtc = getCurrentUTCStartOfDay();

  const dayAfterDecisionDate = add(date, { days: 1 });
  const tomorrowUtc = add(todayUtc, { days: 1 });

  let availableDateTime = todayLocal;

  if ((isTodayLocal || isFutureLocal) && !aheadOfUtc) {
    availableDateTime = dayAfterDecisionDate;
  } else if (isTodayLocal && aheadOfUtc && isTodayUtc) {
    availableDateTime = fromUTCToLocalDate(tomorrowUtc);
  } else if ((isTodayLocal || isFutureLocal) && aheadOfUtc && isFutureUtc) {
    const eligibleForUtc = toUTCStartOfDay(dayAfterDecisionDate);
    availableDateTime = fromUTCToLocalDate(eligibleForUtc);
  }

  return formatUTCDateToLocalWithTime(availableDateTime);
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

export const addBlockedMessage = (blockingCriteria, date, errors) => {
  const availableDateTime = getAvailableDateTimeForBlockedIssue(
    blockingCriteria,
    date.dateObj,
  );

  const formattedAvailableDate = formatDateToReadableString(availableDateTime);

  const errorMessage = sharedErrorMessages.decisions.dateUnavailable(
    formattedAvailableDate,
  );

  errors.addError(errorMessage);
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
  const blockingCriteria = isTodayOrInFuture(date);

  if (blockingCriteria.blocked) {
    addBlockedMessage(blockingCriteria, date, errors);
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
