import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

/**
 * Date input field using VA date v3 web component with simplified validation.
 * Provides accessible date selection with built-in validation and error handling.
 * Simplified to use parent-level validation through useFormSection.
 *
 * @component
 * @see [VA Date Input Component](https://design.va.gov/components/form/date-input)
 * @see [Web Components Catalog - Date Selection](../docs/WEB_COMPONENTS_CATALOG.md#date-selection)
 * @see [VA Adapter - Date Handling](../docs/WEB_COMPONENTS_CATALOG.md#component-specific-adapters)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for date validation (unused, kept for API compatibility)
 * @param {string} props.value - Current date value (YYYY-MM-DD format)
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.hint] - Additional help text for the user
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} VA date input component with validation
 *
 * @example
 * ```jsx
 * <DateField
 *   name="dateOfBirth"
 *   label="Date of Birth"
 *   schema={dateOfBirthSchema}
 *   value={formData.dateOfBirth}
 *   onChange={handleFieldChange}
 *   required
 * />
 * ```
 */
export const DateField = ({
  name,
  label,
  schema: _schema,
  value,
  onChange,
  required = false,
  hint,
  error: externalError,
  forceShowError = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const shouldShowError = (touched || forceShowError) && externalError;

  /**
   * Handles date change events from VA components
   * @param {Event} event - Change event
   * @param {string} newValue - New date value
   */
  const handleChange = useCallback(
    (event, newValue) => {
      const dateValue = newValue || event?.target?.value || '';
      onChange(name, dateValue);
    },
    [name, onChange],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <VaDate
      {...props}
      name={name}
      label={label}
      value={value || ''}
      required={required}
      hint={hint}
      error={shouldShowError ? externalError : null}
      onDateChange={handleChange}
      onDateBlur={handleBlur}
    />
  );
};

DateField.propTypes = {
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
