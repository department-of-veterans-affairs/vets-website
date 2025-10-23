import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';
import { createVAComponentProps } from '../../../utils/component-props';

/**
 * Textarea field using VA textarea v3 web component with integrated validation.
 * Provides multi-line text input with character counting, validation, and accessibility features.
 * Commonly used for remarks, comments, and long-form text in VA forms.
 *
 * @component
 * @see [VA Textarea Component](https://design.va.gov/components/form/textarea)
 * @see [Web Components Catalog - Form Components](../docs/WEB_COMPONENTS_CATALOG.md#form-components)
 * @see [Integration Status](../docs/WEB_COMPONENTS_CATALOG.md#integration-status-for-form-21-2008)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the textarea
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Current textarea value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.hint] - Additional help text for the user
 * @param {number} [props.rows=5] - Number of visible text rows
 * @param {number} [props.maxLength] - Maximum character length
 * @param {boolean} [props.charCount=false] - Show character count indicator
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} VA textarea component with validation
 *
 * @example
 * ```jsx
 * <TextareaField
 *   name="remarks"
 *   label="Additional remarks"
 *   schema={remarksSchema}
 *   value={formData.remarks}
 *   onChange={handleFieldChange}
 *   rows={10}
 *   maxLength={500}
 *   charCount={true}
 * />
 * ```
 */
export const TextareaField = ({
  name,
  label,
  schema,
  value,
  onChange,
  required = false,
  hint,
  rows = 5,
  maxLength,
  charCount = false,
  error: externalError,
  ...props
}) => {
  const {
    validateField,
    touchField,
    error: validationError,
    isValidating,
    touched,
  } = useFieldValidation(schema);

  // Validate immediately when forceShowError is true or value changes
  useEffect(
    () => {
      if (schema) {
        // If forceShowError is true, validate immediately without debounce
        validateField(value, props.forceShowError);
      }
    },
    [value, validateField, schema, props.forceShowError],
  );

  const displayError = externalError || validationError;
  const vaProps = createVAComponentProps(
    'va-textarea',
    displayError,
    touched,
    props.forceShowError,
  );

  const handleChange = e => {
    const newValue = e?.detail?.value || e?.target?.value || '';
    onChange(name, newValue);
  };

  const handleBlur = () => {
    touchField();
    // Only validate if there's no external error
    if (!externalError) {
      validateField(value, true);
    }
  };

  return (
    <VaTextarea
      {...props}
      {...vaProps}
      name={name}
      label={label}
      value={value || ''}
      required={required || undefined}
      hint={hint}
      rows={rows}
      maxlength={maxLength}
      charcount={charCount}
      onInput={handleChange}
      onBlur={handleBlur}
      aria-describedby={isValidating ? `${name}-validating` : undefined}
    />
  );
};

TextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  charCount: PropTypes.bool,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  rows: PropTypes.number,
  value: PropTypes.string,
};
