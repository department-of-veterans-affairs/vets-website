import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';

/**
 * Radio button group field component - thin integration layer for VA React bindings
 *
 * @component
 * @see [VA Radio Button](https://design.va.gov/components/form/radio-button)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} [props.label] - Label text displayed above the radio group (optional when using page-level title)
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {string} props.value - Currently selected option value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {Array<{value: string, label: string, description?: string}>} props.options - Radio button options
 * @param {boolean} [props.required=false] - Whether a selection is required
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @param {boolean} [props.tile=false] - Use tile style for radio buttons
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
  forceShowError = false,
  tile = false,
  ...props
}) => {
  const {
    validateField,
    touchField,
    error: validationError,
    touched,
  } = useFieldValidation(schema);

  // Use external error if provided, otherwise use validation error
  const errorToDisplay = externalError || validationError;
  // Show error if forceShowError (form submitted) OR field was touched
  const showError = forceShowError || touched;
  const finalError =
    showError && errorToDisplay ? String(errorToDisplay) : undefined;

  /**
   * Handle value change events from the VA Radio component
   * @param {Event} event - The value change event from va-radio
   */
  const handleValueChange = React.useCallback(
    event => {
      const newValue = event?.detail?.value;
      if (newValue !== undefined) {
        onChange(name, newValue);
        validateField(newValue);
      }
    },
    [name, onChange, validateField],
  );

  /**
   * Handle blur events to mark field as touched and trigger validation
   */
  const handleBlur = React.useCallback(
    () => {
      touchField();
      validateField(value, true);
    },
    [touchField, validateField, value],
  );

  return (
    <VaRadio
      label={label}
      required={required}
      hint={hint}
      value={value ?? null}
      error={finalError}
      onBlur={handleBlur}
      onVaValueChange={handleValueChange}
      {...(tile ? { tile: true } : {})}
      {...props}
    >
      {options.map(option => {
        const isChecked = value === option.value;
        return (
          <VaRadioOption
            key={option.value}
            label={option.label}
            value={option.value}
            {...(isChecked ? { checked: true } : {})}
            description={option.description}
          />
        );
      })}
    </VaRadio>
  );
};

RadioField.propTypes = {
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
  label: PropTypes.string,
  required: PropTypes.bool,
  tile: PropTypes.bool,
  value: PropTypes.string,
};
