import PropTypes from 'prop-types';
import React from 'react';
import { ReviewField } from '../review-field';

/**
 * Review field component for displaying a date in review mode.
 * Formats dates in a readable format.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {string|Object} props.value - Date value (ISO string or date object with month/day/year)
 * @param {string} [props.format='long'] - Date format: 'long' (January 1, 2023) or 'short' (01/01/2023)
 * @param {string} [props.emptyText='Not provided'] - Text to show when empty
 * @param {boolean} [props.hideWhenEmpty=false] - Hide the field entirely when empty
 * @returns {JSX.Element|null} Review field row
 *
 * @example
 * <ReviewDateField label="Birth Date" value="1990-01-15" />
 * <ReviewDateField
 *   label="Birth Date"
 *   value={{ month: '01', day: '15', year: '1990' }}
 *   format="short"
 * />
 */
export const ReviewDateField = ({
  label,
  value,
  format = 'long',
  emptyText = 'Not provided',
  hideWhenEmpty = false,
}) => {
  const formatDate = dateValue => {
    if (!dateValue) return '';

    // Handle object format {month, day, year}
    if (typeof dateValue === 'object' && dateValue.month && dateValue.year) {
      const { month, day, year } = dateValue;
      const dateObj = new Date(year, parseInt(month, 10) - 1, day || 1);

      if (format === 'short') {
        return `${month}/${day || '01'}/${year}`;
      }

      const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
      return day ? `${monthName} ${day}, ${year}` : `${monthName} ${year}`;
    }

    // Handle ISO string format (YYYY-MM-DD)
    if (typeof dateValue === 'string') {
      // Parse date components directly to avoid timezone issues
      const [year, month, day] = dateValue.split('-').map(Number);

      if (format === 'short') {
        return `${String(month).padStart(2, '0')}/${String(day).padStart(
          2,
          '0',
        )}/${year}`;
      }

      // Create date object for month name (use UTC to avoid timezone shifts)
      const dateObj = new Date(Date.UTC(year, month - 1, day));
      const monthName = dateObj.toLocaleString('en-US', {
        month: 'long',
        timeZone: 'UTC',
      });
      return `${monthName} ${day}, ${year}`;
    }

    return '';
  };

  return (
    <ReviewField
      label={label}
      value={value}
      formatter={formatDate}
      emptyText={emptyText}
      hideWhenEmpty={hideWhenEmpty}
    />
  );
};

ReviewDateField.propTypes = {
  label: PropTypes.string.isRequired,
  emptyText: PropTypes.string,
  format: PropTypes.oneOf(['long', 'short']),
  hideWhenEmpty: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      day: PropTypes.string,
      month: PropTypes.string,
      year: PropTypes.string,
    }),
  ]),
};
