import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useFieldValidation } from '../../../hooks/use-field-validation';

/**
 * Social Security Number field component using VA web components
 * Automatically formats SSN with dashes (XXX-XX-XXXX)
 * Simplified to use native validation with parent-level Zod validation
 *
 * @component
 * @see [VA Text Input](https://design.va.gov/components/form/text-input)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation (unused, kept for API compatibility)
 * @param {string} props.value - Current SSN value (formatted or unformatted)
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.hint] - Additional help text for the user
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} VA SSN input component with formatting
 */
export const SSNField = ({
  name,
  label,
  schema,
  value,
  onChange,
  required = false,
  hint,
  error: externalError,
  forceShowError = false,
  ...props
}) => {
  const {
    validateField,
    touchField,
    error: validationError,
    touched,
  } = useFieldValidation(schema);

  // Use external error if provided, otherwise use validation error
  const displayError = externalError || validationError;
  const shouldShowError = (touched || forceShowError) && displayError;

  // Validate on value change - immediate if forceShowError is true
  useEffect(
    () => {
      if (schema) {
        validateField(value, forceShowError);
      }
    },
    [value, validateField, schema, forceShowError],
  );

  const formatSSN = ssnValue => {
    const digits = ssnValue.replace(/\D/g, '');

    if (digits.length >= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(
        5,
        9,
      )}`;
    }
    if (digits.length >= 4) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };

  const handleChange = useCallback(
    e => {
      const inputValue = e?.detail?.value || e?.target?.value || '';
      const digitsOnly = inputValue.replace(/\D/g, '');

      if (digitsOnly.length <= 9) {
        const formatted = formatSSN(digitsOnly);
        onChange(name, formatted);
      }
    },
    [name, onChange],
  );

  const handleBlur = useCallback(
    () => {
      touchField();
      // Only validate if there's no external error
      if (schema && !externalError) {
        validateField(value, true);
      }
    },
    [touchField, validateField, value, schema, externalError],
  );

  return (
    <VaTextInput
      {...props}
      name={name}
      label={label}
      value={value || ''}
      required={required}
      type="text"
      hint={hint}
      inputmode="numeric"
      pattern="[0-9]{3}-?[0-9]{2}-?[0-9]{4}"
      maxlength="11"
      autocomplete="off"
      error={shouldShowError ? displayError : null}
      onInput={handleChange}
      onBlur={handleBlur}
    />
  );
};

SSNField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  value: PropTypes.string,
};
