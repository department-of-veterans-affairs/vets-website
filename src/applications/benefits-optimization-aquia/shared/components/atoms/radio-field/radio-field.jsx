import PropTypes from 'prop-types';
import React from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';
import { createVAComponentProps } from '../../../utils/component-props';

/**
 * Radio button group field component using VA web components
 * Provides a group of radio buttons for single-choice selection with validation
 * Uses VA adapter pattern for consistent error handling
 *
 * @component
 * @see [VA Radio Button](https://design.va.gov/components/form/radio-button)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label/legend text displayed above the radio group
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Currently selected option value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {Array<{value: string, label: string, description?: string}>} props.options - Radio button options
 * @param {boolean} [props.required=false] - Whether a selection is required
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} VA radio button group component with validation
 */
export const RadioField = ({
  name,
  label,
  schema,
  value,
  onChange,
  options,
  required = false,
  hint,
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

  const displayError = externalError || validationError;
  const vaProps = createVAComponentProps(
    'va-radio',
    displayError,
    touched,
    props.forceShowError,
  );

  const handleChange = selectedValue => {
    onChange(name, selectedValue);
  };

  const handleBlur = () => {
    touchField();
    validateField(value, true);
  };

  return (
    <va-radio
      {...props}
      {...vaProps}
      label={label}
      required={required}
      hint={hint}
      onBlur={handleBlur}
      onVaValueChange={e => handleChange(e.detail.value)}
      aria-describedby={isValidating ? `${name}-validating` : undefined}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          label={option.label}
          value={option.value}
          checked={value === option.value}
          description={option.description}
        />
      ))}
    </va-radio>
  );
};

RadioField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
};
