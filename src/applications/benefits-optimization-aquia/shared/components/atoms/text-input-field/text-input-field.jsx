import PropTypes from 'prop-types';
import React from 'react';

/**
 * Text input field component using VA Design System.
 * Uses va-text-input web component for basic single-line text input.
 * Provides standard text entry for names, labels, short descriptions, and other textual data.
 *
 * @component
 * @see [VA Text Input Component](https://design.va.gov/components/form/text-input)
 * @see [USWDS Text Input](https://designsystem.digital.gov/components/text-input/)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {string} props.value - Current field value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors even if untouched
 * @param {import('zod').ZodSchema} [props.schema] - Zod schema for validation (not used by va-text-input but kept for consistency)
 * @param {string} [props.hint] - Additional help text for the user
 * @param {number} [props.maxlength] - Maximum character length allowed
 * @returns {JSX.Element} VA text input field
 *
 * @example
 * ```jsx
 * <TextInputField
 *   name="employerName"
 *   label="Employer's name"
 *   value={formData.employerName}
 *   onChange={handleFieldChange}
 *   required={true}
 *   maxlength={100}
 * />
 * ```
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
