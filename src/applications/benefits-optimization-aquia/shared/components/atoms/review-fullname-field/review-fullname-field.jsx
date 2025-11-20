import PropTypes from 'prop-types';
import React from 'react';
import { ReviewField } from '../review-field';

/**
 * Review field component for displaying a full name in review mode.
 * Formats first, middle, last, and suffix into a readable string.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.label='Full Name'] - Field label
 * @param {Object} props.value - Name object with first, middle, last, suffix
 * @param {string} [props.emptyText='Not provided'] - Text to show when empty
 * @param {boolean} [props.hideWhenEmpty=false] - Hide the field entirely when empty
 * @returns {JSX.Element|null} Review field row
 *
 * @example
 * <ReviewFullnameField
 *   value={{ first: 'John', middle: 'Q', last: 'Doe', suffix: 'Jr.' }}
 * />
 */
export const ReviewFullnameField = ({
  label = 'Full Name',
  value,
  emptyText = 'Not provided',
  hideWhenEmpty = false,
}) => {
  const formatFullName = nameObj => {
    if (!nameObj || typeof nameObj !== 'object') {
      return '';
    }

    const parts = [nameObj.first, nameObj.middle, nameObj.last, nameObj.suffix]
      .map(part => (part ? part.trim() : ''))
      .filter(Boolean);

    return parts.join(' ');
  };

  // Format the name first to check if it's empty
  const formattedName = formatFullName(value);

  return (
    <ReviewField
      label={label}
      value={formattedName || null}
      emptyText={emptyText}
      hideWhenEmpty={hideWhenEmpty}
    />
  );
};

ReviewFullnameField.propTypes = {
  emptyText: PropTypes.string,
  hideWhenEmpty: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }),
};
