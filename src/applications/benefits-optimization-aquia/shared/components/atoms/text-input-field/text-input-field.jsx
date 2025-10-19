import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';
import { logger } from '../../../utils/logger';

/**
 * Generic text input field with VA web component integration and Zod validation.
 * Use this component for generic text inputs that don't require specialized formatting or validation.
 * Uses native va-text-input v3 web component for consistent VA.gov styling.
 *
 * For specialized data types, use dedicated components:
 * - {@link SSNField} for Social Security numbers
 * - {@link PhoneField} for phone numbers
 * - {@link SelectField} for dropdowns (states, countries, etc.)
 * - {@link MemorableDateField} for dates
 * - {@link TextareaField} for multi-line text
 * - {@link FullnameField} for full name (first, middle, last, suffix)
 * - {@link AddressField} for complete addresses
 *
 * @component
 * @see [VA Text Input Component](https://design.va.gov/components/form/text-input)
 * @see [VA Input Messages](https://design.va.gov/components/form/input-message)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Current field value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.type='text'] - HTML input type (text, email, url, etc.)
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors even if untouched
 * @param {boolean} [props.debug=false] - Enable debug logging for validation
 * @returns {JSX.Element} VA text input web component with validation
 *
 * @example
 * ```jsx
 * <TextInputField
 *   name="placeOfEntry"
 *   label="Place of entry"
 *   schema={placeOfEntrySchema}
 *   value={formData.placeOfEntry}
 *   onChange={handleFieldChange}
 *   hint="Enter the city and state or name of the military base"
 * />
 * ```
 */
export const TextInputField = ({
  name,
  label,
  schema,
  value,
  onChange,
  required = false,
  type = 'text',
  hint,
  error: externalError,
  forceShowError = false,
  debug = false,
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

  // Validate on value change
  useEffect(
    () => {
      if (schema) {
        validateField(value);
      }
    },
    [value, validateField, schema],
  );

  const handleChange = useCallback(
    e => {
      const newValue = e.target ? e.target.value : e.detail?.value;
      onChange(name, newValue);
    },
    [name, onChange],
  );

  const handleBlur = useCallback(
    () => {
      touchField();
      if (schema) {
        validateField(value, true);
      }
    },
    [touchField, validateField, value, schema],
  );

  if (debug) {
    logger.debug(`TextInputField[${name}]:`, {
      externalError,
      validationError,
      displayError,
      touched,
      forceShowError,
      shouldShowError,
    });
  }

  return (
    <VaTextInput
      {...props}
      name={name}
      label={label}
      value={value || ''}
      type={type}
      hint={hint}
      required={required}
      error={shouldShowError ? displayError : null}
      onInput={handleChange}
      onBlur={handleBlur}
    />
  );
};

TextInputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  debug: PropTypes.bool,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.string,
};
