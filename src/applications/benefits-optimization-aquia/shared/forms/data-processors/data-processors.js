/**
 * @module forms/data-processors
 * @description Data processing utilities for form data transformation.
 * Provides utilities for transforming form data before submission.
 */

/**
 * Transforms date objects to ISO string format (YYYY-MM-DD).
 * Handles both Date objects and custom date structures with month/day/year properties.
 *
 * @param {Object} formData - Form data containing date fields
 * @param {Array<string>} dateFields - Array of field names to process
 * @param {Function} [formatter] - Custom date formatter function
 * @returns {Object} Processed form data with formatted dates
 * @example
 * transformDates(
 *   { birthDate: { month: 1, day: 15, year: 1990 } },
 *   ['birthDate']
 * ) // { birthDate: '1990-01-15' }
 */
export const transformDates = (formData, dateFields = [], formatter) => {
  if (!formData) return formData;

  const defaultFormatter = dateObj => {
    if (dateObj.month && dateObj.year) {
      const month = String(dateObj.month).padStart(2, '0');
      const day = String(dateObj.day || '01').padStart(2, '0');
      const { year } = dateObj;
      return `${year}-${month}-${day}`;
    }
    if (dateObj instanceof Date) {
      // Check if date is valid before converting to ISO string
      if (!Number.isNaN(dateObj.getTime())) {
        return dateObj.toISOString().split('T')[0];
      }
      // Return empty string for invalid dates
      return '';
    }
    return dateObj;
  };

  const dateFormatter = formatter || defaultFormatter;
  const processed = { ...formData };

  dateFields.forEach(field => {
    if (processed[field] && typeof processed[field] === 'object') {
      processed[field] = dateFormatter(processed[field]);
    }
  });

  return processed;
};
