import PropTypes from 'prop-types';
import React from 'react';

/**
 * Input message component for displaying validation feedback.
 * Uses native va-input-message web component for consistent VA.gov styling.
 * Typically used alongside form fields to show error, warning, or success messages.
 *
 * @component
 * @see [VA Input Message](https://design.va.gov/components/form/input-message)
 * @param {Object} props - Component props
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.success] - Success message to display
 * @param {string} [props.warning] - Warning message to display
 * @param {string} [props.fieldId] - ID of the associated form field for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} VA input message web component
 */
export const InputMessageField = ({
  error,
  success,
  warning,
  fieldId,
  className,
  ...props
}) => {
  if (!error && !success && !warning) {
    return null;
  }

  let messageType = 'info';
  let message = '';

  if (error) {
    messageType = 'error';
    message = error;
  } else if (warning) {
    messageType = 'warning';
    message = warning;
  } else if (success) {
    messageType = 'success';
    message = success;
  }

  return (
    <va-input-message
      {...props}
      class={className}
      message-type={messageType}
      message={message}
      aria-live="polite"
      aria-atomic="true"
      {...fieldId && { 'aria-describedby': fieldId }}
    />
  );
};

InputMessageField.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  fieldId: PropTypes.string,
  success: PropTypes.string,
  warning: PropTypes.string,
};
