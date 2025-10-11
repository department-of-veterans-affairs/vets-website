import PropTypes from 'prop-types';
import React from 'react';

/**
 * Review field component for displaying a single field in review mode.
 * Follows VA.gov platform review styling patterns.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {any} props.value - Field value to display
 * @param {Function} [props.formatter] - Optional function to format the value
 * @param {string} [props.emptyText='Not provided'] - Text to show when value is empty
 * @param {boolean} [props.hideWhenEmpty=false] - Hide the field entirely when empty
 * @returns {JSX.Element|null} Review field row
 *
 * @example
 * <ReviewField label="Full Name" value="John Doe" />
 * <ReviewField
 *   label="Birth Date"
 *   value="1990-01-15"
 *   formatter={(val) => new Date(val).toLocaleDateString()}
 * />
 */
export const ReviewField = ({
  label,
  value,
  formatter,
  emptyText = 'Not provided',
  hideWhenEmpty = false,
}) => {
  const isEmpty = value === null || value === undefined || value === '';

  if (isEmpty && hideWhenEmpty) {
    return null;
  }

  let displayValue;
  if (isEmpty) {
    displayValue = emptyText;
  } else if (formatter) {
    displayValue = formatter(value);
  } else {
    // Convert booleans and other non-string values to strings for display
    displayValue = typeof value === 'boolean' ? String(value) : value;
  }

  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>{displayValue}</dd>
    </div>
  );
};

ReviewField.propTypes = {
  label: PropTypes.string.isRequired,
  emptyText: PropTypes.string,
  formatter: PropTypes.func,
  hideWhenEmpty: PropTypes.bool,
  value: PropTypes.any,
};
