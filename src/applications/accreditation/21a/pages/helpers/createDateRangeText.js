import { formatReviewDate } from './formatReviewDate';

/**
 * Creates a formatted date range string.
 * @param {Object} item - List loop item
 * @param {string} currentKey - The schema key that stores the boolean value indicating if the end date is 'Present'
 * @returns {string} - The formatted date range string.
 */
export const createDateRangeText = (item, currentKey) => {
  return `${formatReviewDate(item?.dateRange?.from)} - ${
    item?.[currentKey] ? 'Present' : formatReviewDate(item?.dateRange?.to)
  }`;
};
