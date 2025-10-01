import {
  VaCheckbox,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { createVAComponentProps } from '../../../utils/component-props';

/**
 * Checkbox group field with multiple selection support.
 * Renders a fieldset with multiple va-checkbox web components.
 * Validation is handled at the form level.
 *
 * @component
 * @see [VA Checkbox Component](https://design.va.gov/components/form/checkbox)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Field label/legend displayed above the checkbox group
 * @param {Array<string>} props.value - Array of currently selected option values
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {Array<{value: string, label: string, description?: string}>} props.options - Checkbox options array
 * @param {boolean} [props.required=false] - Whether at least one selection is required
 * @param {string} [props.hint] - Additional help text displayed below the label
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors even if untouched
 * @returns {JSX.Element} VA checkbox group component with validation
 */
export const CheckboxGroupField = ({
  name,
  label,
  value = [],
  onChange,
  options,
  required = false,
  hint,
  error,
  forceShowError = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const vaProps = createVAComponentProps(
    'va-checkbox-group',
    error,
    touched || forceShowError,
    forceShowError,
  );

  const handleCheckboxChange = (optionValue, checked) => {
    const currentValue = Array.isArray(value) ? value : [];
    let newValue = [...currentValue];

    if (checked) {
      if (!newValue.includes(optionValue)) {
        newValue.push(optionValue);
      }
    } else {
      newValue = newValue.filter(v => v !== optionValue);
    }

    if (!touched) {
      setTouched(true);
    }

    onChange(name, newValue);
  };

  const handleBlur = () => {
    if (!touched) {
      setTouched(true);
    }
  };

  return (
    <VaCheckboxGroup
      {...props}
      {...vaProps}
      label={label}
      required={required}
      hint={hint}
      onBlur={handleBlur}
    >
      {options.map(option => {
        const isChecked = (value || []).includes(option.value);
        return (
          <VaCheckbox
            key={option.value}
            label={option.label}
            value={option.value}
            checked={isChecked}
            checkboxDescription={option.description}
            onVaChange={e => {
              const checkedState = e.detail?.checked ?? false;
              handleCheckboxChange(option.value, checkedState);
            }}
          />
        );
      })}
    </VaCheckboxGroup>
  );
};

CheckboxGroupField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.string),
};
