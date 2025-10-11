import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';
import { logger } from '../../../utils/logger';

/**
 * Text input field with VA web component integration and Zod validation.
 * Simplified to leverage native VA component validation with Zod schema support.
 * Uses native va-text-input v3 web component for consistent VA.gov styling.
 *
 * @deprecated Use more specific field components instead for better semantics and validation:
 * - {@link SSNField} for Social Security numbers
 * - {@link PhoneField} for phone numbers
 * - {@link SelectField} for dropdowns (states, countries, etc.)
 * - {@link MemorableDateField} for dates
 * - {@link TextareaField} for multi-line text
 * - {@link CheckboxField} for boolean values
 * - {@link RadioField} for single selection from options
 * - {@link FullnameField} for full name (first, middle, last, suffix)
 * - {@link AddressField} for complete addresses
 *
 * Only use FormField for generic text inputs that don't have a specialized component.
 *
 * @component
 * @see [VA Text Input Component](https://design.va.gov/components/form/text-input)
 * @see [VA Input Messages](https://design.va.gov/components/form/input-message)
 * @see [Web Components Catalog - Text Input](../docs/WEB_COMPONENTS_CATALOG.md#text-input-fields)
 * @see [VA Adapter Architecture](../docs/WEB_COMPONENTS_CATALOG.md#va-adapter-architecture)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Current field value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the field is required (unused, kept for API compatibility)
 * @param {string} [props.type='text'] - HTML input type (text, email, url, etc.)
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors even if untouched
 * @param {boolean} [props.debug=false] - Enable debug logging for validation
 * @returns {JSX.Element} VA text input web component with validation
 *
 * @example
 * ```jsx
 * // ❌ Don't use for phone numbers
 * <FormField
 *   name="phone"
 *   label="Phone Number"
 *   schema={phoneSchema}
 *   value={formData.phone}
 *   onChange={handleFieldChange}
 * />
 *
 * // ✅ Use PhoneField instead
 * <PhoneField
 *   name="phone"
 *   label="Phone Number"
 *   schema={phoneSchema}
 *   value={formData.phone}
 *   onChange={handleFieldChange}
 * />
 *
 * // ✅ OK for generic text without a specialized component
 * <FormField
 *   name="organizationName"
 *   label="Organization Name"
 *   schema={organizationNameSchema}
 *   value={formData.organizationName}
 *   onChange={handleFieldChange}
 * />
 * ```
 */
export const FormField = ({
  name,
  label,
  schema,
  value,
  onChange,
  required: _required = false,
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
    logger.debug(`FormField[${name}]:`, {
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
      required={_required}
      error={shouldShowError ? displayError : null}
      onInput={handleChange}
      onBlur={handleBlur}
    />
  );
};

FormField.propTypes = {
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
