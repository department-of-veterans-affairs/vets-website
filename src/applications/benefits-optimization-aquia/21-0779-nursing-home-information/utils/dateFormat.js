/**
 * @module utils/dateFormat
 * @description Utilities for formatting dates
 * VA Form 21-0779 - Request for Nursing Home Information
 */

import { isValid } from 'date-fns';
import { formatDateShort } from 'platform/utilities/date';

/**
 * Formats a date string for display
 * @param {string} dateString - Date string to format (YYYY-MM-DD or YYYY/MM/DD)
 * @returns {string} Formatted date string or 'Not provided' if invalid
 */
export const formatDate = dateString => {
  if (!dateString) return 'Not provided';

  try {
    const birthDate = new Date(dateString.replace(/-/g, '/'));
    return isValid(birthDate) ? formatDateShort(birthDate) : 'Not provided';
  } catch (error) {
    return dateString || 'Not provided';
  }
};
