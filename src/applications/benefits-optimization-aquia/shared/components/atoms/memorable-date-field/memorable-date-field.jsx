import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

/**
 * Memorable date field with VA web component integration and simplified validation.
 * Uses three separate inputs for month, day, and year for better accessibility.
 * Simplified to use parent-level validation through useFormSection.
 *
 * @component
 * @see {@link https://design.va.gov/components/form/memorable-date|VA Memorable Date}
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the field
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation (unused, kept for API compatibility)
 * @param {Object} props.value - Current date value {month, day, year}
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.required=false] - Whether the date is required
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @param {boolean} [props.monthYearOnly=false] - Only show month and year inputs
 * @returns {JSX.Element} VA memorable date web component with validation
 */
export const MemorableDateField = ({
  name,
  label,
  schema: _schema,
  value,
  onChange,
  required = false,
  hint,
  error: externalError,
  forceShowError = false,
  monthYearOnly = false,
  monthSelect = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const shouldShowError = (touched || forceShowError) && externalError;

  const handleDateChange = useCallback(
    (event, newValue) => {
      const dateString = newValue || event?.target?.value || '';

      onChange(name, dateString);
    },
    [name, onChange],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <VaMemorableDate
      {...props}
      name={name}
      label={label}
      monthSelect={monthSelect}
      monthYearOnly={monthYearOnly}
      value={value || ''}
      required={required}
      hint={hint || ''}
      error={shouldShowError ? externalError : null}
      onDateChange={handleDateChange}
      onDateBlur={handleBlur}
    />
  );
};

MemorableDateField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  monthSelect: PropTypes.bool,
  monthYearOnly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      month: PropTypes.string,
      day: PropTypes.string,
      year: PropTypes.string,
    }),
  ]),
};
