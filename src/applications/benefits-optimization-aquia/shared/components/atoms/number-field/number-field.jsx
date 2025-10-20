import PropTypes from 'prop-types';
import React from 'react';

/**
 * Number input field component using VA Design System.
 * Uses va-text-input web component with inputmode="numeric" for proper numeric keyboard on mobile devices.
 * Ideal for collecting numeric data like hours, counts, or identification numbers.
 *
 * @component
 * @see [VA Text Input Component](https://design.va.gov/components/form/text-input)
 * @see [USWDS Text Input](https://designsystem.digital.gov/components/text-input/)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {string|number} props.value - Current field value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors even if untouched
 * @param {import('zod').ZodSchema} [props.schema] - Zod schema for validation (not used by va-text-input but kept for consistency)
 * @param {string} [props.hint] - Additional help text for the user
 * @param {number} [props.min] - Minimum allowed value
 * @param {number} [props.max] - Maximum allowed value
 * @param {string} [props.inputmode='numeric'] - Input mode for mobile keyboards (numeric, decimal, tel)
 * @returns {JSX.Element} VA number input field
 *
 * @example
 * ```jsx
 * <NumberField
 *   name="dailyHours"
 *   label="Number of hours worked (daily)"
 *   value={formData.dailyHours}
 *   onChange={handleFieldChange}
 *   hint="Enter the number of hours worked per day"
 *   min={0}
 *   max={24}
 * />
 * ```
 */
export const NumberField = ({
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  forceShowError = false,
  hint,
  min,
  max,
  inputmode = 'numeric',
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
      required={required || undefined}
      hint={hint}
      message-aria-describedby={hint ? `${name}-hint` : null}
      inputmode={inputmode}
      min={min}
      max={max}
    />
  );
};

NumberField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  inputmode: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  required: PropTypes.bool,
  schema: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default NumberField;
