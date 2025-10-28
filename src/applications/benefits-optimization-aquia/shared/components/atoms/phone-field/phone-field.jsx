import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { useFieldValidation } from '../../../hooks/use-field-validation';

/**
 * Phone number input field with specialized VA telephone web component.
 * Simplified to leverage native VA component validation.
 * Uses native va-telephone-input for editing and va-telephone for display.
 * Defaults to US phone numbers with country selector shown.
 *
 * @caution va-telephone-input is currently v1 and marked "Use with Caution" in VA Design System - v3 migration pending
 *
 * @see [VA Telephone Input](https://design.va.gov/components/form/telephone-input)
 * @see [VA Telephone Display](https://design.va.gov/components/telephone)
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Current phone number value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.hint] - Additional help text for the user
 * @param {boolean} [props.displayOnly=false] - Show as formatted telephone link instead of input
 * @param {string} [props.extension] - Phone extension number for display mode
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors even if untouched
 * @param {boolean} [props.showCountrySelector=true] - Show country code selector (defaults to US +1)
 * @returns {JSX.Element} VA telephone web component for input or display
 */
export const PhoneField = ({
  name,
  label,
  schema,
  value,
  onChange,
  required = false,
  hint,
  displayOnly = false,
  extension,
  error: externalError,
  forceShowError = false,
  showCountrySelector = true,
  ..._props
}) => {
  const phoneRef = useRef(null);
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

  useEffect(
    () => {
      const phoneElement = phoneRef.current;
      if (!phoneElement) return undefined;

      const handlePhoneChange = e => {
        const phoneValue = e?.detail?.contact || e?.detail?.value || '';
        onChange(name, phoneValue);
      };

      phoneElement.addEventListener('vaContact', handlePhoneChange);

      return () => {
        phoneElement.removeEventListener('vaContact', handlePhoneChange);
      };
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

  if (displayOnly) {
    if (!value) {
      return null;
    }
    return (
      <div className="vads-u-margin-bottom--2">
        {label && (
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-bottom--0p5">
            {label}
          </span>
        )}
        <va-telephone
          contact={value}
          extension={extension}
          not-clickable={false}
        />
      </div>
    );
  }

  const noCountry = showCountrySelector ? undefined : 'true';

  return (
    <va-telephone-input
      {..._props}
      ref={phoneRef}
      name={name}
      label={label}
      value={value || ''}
      contact={value || ''}
      required={required}
      hint={hint || 'Enter 10-digit phone number'}
      no-country={noCountry}
      country="US"
      error={shouldShowError ? displayError : null}
      onBlur={handleBlur}
    />
  );
};

PhoneField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  displayOnly: PropTypes.bool,
  error: PropTypes.string,
  extension: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  showCountrySelector: PropTypes.bool,
  value: PropTypes.string,
};
