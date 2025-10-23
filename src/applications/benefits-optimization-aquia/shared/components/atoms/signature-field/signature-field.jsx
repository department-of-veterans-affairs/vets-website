import PropTypes from 'prop-types';
import React from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';

/**
 * Electronic signature field component using VA web components
 * Provides a text input for capturing electronic signatures with validation
 *
 * @component
 * @see [VA Text Input](https://design.va.gov/components/form/text-input)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the signature field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Current signature value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=true] - Whether signature is required (usually true)
 * @param {string} [props.hint] - Additional instructions for signing
 * @param {string} [props.fullName] - Full name to match against (for validation)
 * @param {string} [props.error] - External error message to display
 * @returns {JSX.Element} VA text input configured for electronic signature
 */
export const SignatureField = ({
  name,
  label = 'Electronic signature',
  schema,
  value,
  onChange,
  required = true,
  hint = 'Please type your full name as your electronic signature',
  fullName,
  error: externalError,
  ...props
}) => {
  const {
    validateField,
    touchField,
    error: validationError,
    isValidating,
  } = useFieldValidation(schema);

  const displayError = externalError || validationError;

  const handleChange = e => {
    const signatureValue = e?.detail?.value || e?.target?.value || '';
    onChange(name, signatureValue);
  };

  const handleBlur = () => {
    touchField();

    if (fullName && value) {
      const normalizedSignature = value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
      const normalizedFullName = fullName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      if (normalizedSignature !== normalizedFullName) {
        validateField(value, true, {
          message: 'Signature must match your full name',
        });
      } else {
        validateField(value, true);
      }
    } else {
      validateField(value, true);
    }
  };

  return (
    <div className="signature-field vads-u-margin-bottom--2">
      <va-text-input
        {...props}
        name={name}
        label={label}
        value={value || ''}
        error={displayError}
        required={required}
        hint={hint}
        type="text"
        autocomplete="off"
        onInput={handleChange}
        onBlur={handleBlur}
        aria-describedby={isValidating ? `${name}-validating` : undefined}
      />
      {fullName && (
        <div className="vads-u-color--gray-medium vads-u-margin-top--0p5">
          <small>Your name on file: {fullName}</small>
        </div>
      )}
    </div>
  );
};

SignatureField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  fullName: PropTypes.string,
  hint: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
};
