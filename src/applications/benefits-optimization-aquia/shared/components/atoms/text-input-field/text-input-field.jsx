import PropTypes from 'prop-types';
import React from 'react';

/**
 * Text input field component using VA Design System
 * Uses va-text-input web component for basic text input
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form handling
 * @param {string} props.label - Label text for the field
 * @param {string} props.value - Current field value
 * @param {Function} props.onChange - Change handler function
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {boolean} [props.forceShowError=false] - Force show error even if not touched
 * @param {Object} [props.schema] - Zod schema for validation (not used by va-text-input but kept for consistency)
 * @param {string} [props.hint] - Optional hint text
 * @param {number} [props.maxlength] - Maximum character length
 * @returns {JSX.Element} Text input field
 */
export const TextInputField = ({
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  forceShowError = false,
  hint,
  maxlength,
}) => {
  const handleChange = event => {
    const newValue = event.target.value;
    onChange(name, newValue);
  };

  const showError = error && forceShowError;

  return (
    <va-text-input
      label={label}
      name={name}
      value={value || ''}
      onInput={handleChange}
      error={showError ? error : null}
      required={required}
      hint={hint}
      message-aria-describedby={hint ? `${name}-hint` : null}
      maxlength={maxlength}
    />
  );
};

TextInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  maxlength: PropTypes.number,
  required: PropTypes.bool,
  schema: PropTypes.object,
  value: PropTypes.string,
};

export default TextInputField;
