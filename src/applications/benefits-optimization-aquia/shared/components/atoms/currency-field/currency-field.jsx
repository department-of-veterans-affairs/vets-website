import PropTypes from 'prop-types';
import React from 'react';

/**
 * Currency input field component using VA Design System.
 * Uses va-text-input web component with currency variant for automatic dollar sign and comma formatting.
 * Handles monetary values with proper US currency formatting (e.g., $1,234.56).
 *
 * @component
 * @see [VA Text Input with Currency](https://design.va.gov/storybook/?path=/story/uswds-va-text-input--with-currency)
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
 * @returns {JSX.Element} VA currency input field
 *
 * @example
 * ```jsx
 * <CurrencyField
 *   name="grossAmountLastPayment"
 *   label="Gross amount of last payment"
 *   value={formData.grossAmountLastPayment}
 *   onChange={handleFieldChange}
 *   required={true}
 * />
 * ```
 */
export const CurrencyField = ({
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  forceShowError = false,
  hint,
}) => {
  const handleChange = event => {
    const newValue = event.target.value;
    onChange(name, newValue);
  };

  const showError = error && forceShowError;

  return (
    <va-text-input
      currency
      label={label}
      name={name}
      value={value || ''}
      onInput={handleChange}
      error={showError ? error : null}
      required={required}
      hint={hint}
      message-aria-describedby={hint ? `${name}-hint` : null}
    />
  );
};

CurrencyField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CurrencyField;
