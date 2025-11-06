/**
 * @module components/atoms/checkbox-field
 * @description Checkbox field component with VA Design System integration.
 * Provides validation, error handling, and accessibility features.
 */

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';
import { createVAComponentProps } from '../../../utils/component-props';
import { debugValidation } from '../../../utils/debug-utils';
import { logger } from '../../../utils/logger';
import { zodErrorToMessage } from '../../../utils/zod-integration';

/**
 * Checkbox field with VA web component integration and Zod validation.
 * Provides single checkbox functionality with error handling and accessibility.
 * Uses native va-checkbox web component for consistent VA.gov styling.
 *
 * @component
 * @see {@link https://design.va.gov/components/form/checkbox|VA Checkbox Documentation}
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed next to the checkbox
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {boolean} props.value - Current checkbox checked state
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the checkbox must be checked
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @param {boolean} [props.debug=false] - Enable debug logging for validation
 * @returns {JSX.Element} VA checkbox web component with validation
 *
 * @example
 * <CheckboxField
 *   name="agreeToTerms"
 *   label="I agree to the terms and conditions"
 *   schema={z.boolean().refine(val => val === true)}
 *   value={formData.agreeToTerms}
 *   onChange={handleChange}
 *   required
 * />
 */
export const CheckboxField = ({
  name,
  label,
  schema,
  value,
  onChange,
  required = false,
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
    isValidating,
    touched,
  } = useFieldValidation(schema);

  const immediateError = useMemo(
    () => {
      if (forceShowError && schema && schema.safeParse) {
        const valueToValidate = value || false;
        try {
          const result = schema.safeParse(valueToValidate);
          if (!result.success && result.error) {
            return zodErrorToMessage(result.error);
          }
        } catch (err) {
          logger.error(`Validation error for ${name}:`, err);
        }
      }
      return '';
    },
    [forceShowError, schema, value, name],
  );

  const displayError = externalError || immediateError || validationError;

  const vaProps = createVAComponentProps(
    'va-checkbox',
    displayError,
    touched,
    forceShowError,
  );

  debugValidation(
    name,
    {
      error: displayError,
      touched,
      forceShow: forceShowError,
      externalError,
      immediateError,
      validationError,
    },
    debug,
  );

  const handleChange = e => {
    const newValue = e.detail?.checked || false;
    onChange(name, newValue);
    validateField(newValue, false);
  };

  const handleBlur = () => {
    touchField();
    validateField(value || false, true);
  };

  return (
    <VaCheckbox
      {...props}
      name={name}
      label={label}
      checked={value || false}
      required={required}
      hint={hint}
      onVaChange={handleChange}
      onBlur={handleBlur}
      aria-describedby={isValidating ? `${name}-validating` : undefined}
      {...vaProps}
    />
  );
};

CheckboxField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  debug: PropTypes.bool,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.bool,
};
