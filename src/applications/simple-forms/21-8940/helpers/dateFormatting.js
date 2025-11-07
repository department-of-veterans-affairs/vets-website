import { formatDateLong } from 'platform/utilities/date';

/**
 * Formats a date range for display in card descriptions.
 * @param {Object} dateRange - Object containing 'from' and 'to' date strings
 * @returns {string} - Formatted date range like "January 1, 2000 - February 1, 2000"
 */
export const formatDateRangeForCard = dateRange => {
  if (!dateRange?.from || !dateRange?.to) {
    return '';
  }

  try {
    const fromDate = formatDateLong(dateRange.from);
    const toDate = formatDateLong(dateRange.to);
    return `${fromDate} - ${toDate}`;
  } catch (error) {
    // Fallback to raw dates if formatting fails
    return `${dateRange.from} - ${dateRange.to}`;
  }
};
