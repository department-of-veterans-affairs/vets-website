/**
 * Date comparison utilities using date-fns
 * Migrated to date-fns for better tree-shaking and smaller bundle size
 */
import {
  parseISO,
  isValid,
  isBefore,
  isAfter,
  isWithinInterval,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns';

/**
 * Internal utility to safely create date-fns compatible Date objects
 * @private
 */
const safeDateFns = date => {
  if (!date) return null;
  // Try parsing as Date object or string, fallback to Date constructor
  const parsedDate =
    date instanceof Date ? date : parseISO(date) || new Date(date);
  return isValid(parsedDate) ? parsedDate : null;
};

/**
 * Helper function to handle granularity-based comparisons
 * @private
 */
const compareWithGranularity = (date1, date2, granularity, comparisonFn) => {
  switch (granularity) {
    case 'year':
      return comparisonFn(startOfYear(date1), startOfYear(date2));
    case 'month':
      return comparisonFn(startOfMonth(date1), startOfMonth(date2));
    case 'day':
    default:
      return comparisonFn(startOfDay(date1), startOfDay(date2));
  }
};

/**
 * Helper function to handle granularity-based same comparisons using direct date-fns functions
 * @private
 */
const compareWithGranularitySame = (date1, date2, granularity) => {
  switch (granularity) {
    case 'year':
      return isSameYear(date1, date2);
    case 'month':
      return isSameMonth(date1, date2);
    case 'day':
    default:
      return isSameDay(date1, date2);
  }
};

/**
 * Check if date1 is before date2
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} granularity - Comparison granularity (day, month, year, etc.)
 * @returns {boolean} True if date1 is before date2
 */
export const isDateBefore = (date1, date2, granularity = 'day') => {
  const firstDate = safeDateFns(date1);
  const secondDate = safeDateFns(date2);

  if (!firstDate || !secondDate) return false;

  return compareWithGranularity(firstDate, secondDate, granularity, isBefore);
};

/**
 * Check if date1 is after date2
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} granularity - Comparison granularity
 * @returns {boolean} True if date1 is after date2
 */
export const isDateAfter = (date1, date2, granularity = 'day') => {
  const firstDate = safeDateFns(date1);
  const secondDate = safeDateFns(date2);

  if (!firstDate || !secondDate) return false;

  return compareWithGranularity(firstDate, secondDate, granularity, isAfter);
};

/**
 * Check if two dates are the same
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} granularity - Comparison granularity
 * @returns {boolean} True if dates are the same
 */
export const isDateSame = (date1, date2, granularity = 'day') => {
  const firstDate = safeDateFns(date1);
  const secondDate = safeDateFns(date2);

  if (!firstDate || !secondDate) return false;

  return compareWithGranularitySame(firstDate, secondDate, granularity);
};

/**
 * Check if a date is between two other dates
 * @param {string} date - Date to check
 * @param {string} startDate - Start of range
 * @param {string} endDate - End of range
 * @param {string} granularity - Comparison granularity
 * @param {string} inclusivity - '()', '[]', '(]', '[)' (default: '[]')
 * @returns {boolean} True if date is between start and end
 */
export const isDateBetween = (
  date,
  startDate,
  endDate,
  granularity = 'day',
  inclusivity = '[]',
) => {
  const dateToCheck = safeDateFns(date);
  const rangeStartDate = safeDateFns(startDate);
  const rangeEndDate = safeDateFns(endDate);

  if (!dateToCheck || !rangeStartDate || !rangeEndDate) return false;

  // Handle inclusivity options
  const includeStart = inclusivity[0] === '[';
  const includeEnd = inclusivity[1] === ']';

  if (includeStart && includeEnd) {
    // []: both inclusive - use isWithinInterval with normalized dates
    switch (granularity) {
      case 'year':
        return isWithinInterval(startOfYear(dateToCheck), {
          start: startOfYear(rangeStartDate),
          end: startOfYear(rangeEndDate),
        });
      case 'month':
        return isWithinInterval(startOfMonth(dateToCheck), {
          start: startOfMonth(rangeStartDate),
          end: startOfMonth(rangeEndDate),
        });
      case 'day':
      default:
        return isWithinInterval(startOfDay(dateToCheck), {
          start: startOfDay(rangeStartDate),
          end: startOfDay(rangeEndDate),
        });
    }
  }

  // For other cases, use our helper functions
  const isAfterStart = includeStart
    ? !compareWithGranularity(
        dateToCheck,
        rangeStartDate,
        granularity,
        isBefore,
      )
    : compareWithGranularity(dateToCheck, rangeStartDate, granularity, isAfter);

  const isBeforeEnd = includeEnd
    ? !compareWithGranularity(dateToCheck, rangeEndDate, granularity, isAfter)
    : compareWithGranularity(dateToCheck, rangeEndDate, granularity, isBefore);

  return isAfterStart && isBeforeEnd;
};

/**
 * General purpose date comparison
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} operator - Comparison operator: '<', '>', '<=', '>=', '==', '!='
 * @param {string} granularity - Comparison granularity
 * @returns {boolean} Result of comparison
 */
export const compareDates = (date1, date2, operator, granularity = 'day') => {
  const firstDate = safeDateFns(date1);
  const secondDate = safeDateFns(date2);

  if (!firstDate || !secondDate) return false;

  switch (operator) {
    case '<':
      return compareWithGranularity(
        firstDate,
        secondDate,
        granularity,
        isBefore,
      );
    case '>':
      return compareWithGranularity(
        firstDate,
        secondDate,
        granularity,
        isAfter,
      );
    case '<=':
      return (
        compareWithGranularity(firstDate, secondDate, granularity, isBefore) ||
        compareWithGranularitySame(firstDate, secondDate, granularity)
      );
    case '>=':
      return (
        compareWithGranularity(firstDate, secondDate, granularity, isAfter) ||
        compareWithGranularitySame(firstDate, secondDate, granularity)
      );
    case '==':
      return compareWithGranularitySame(firstDate, secondDate, granularity);
    case '!=':
      return !compareWithGranularitySame(firstDate, secondDate, granularity);
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
};
