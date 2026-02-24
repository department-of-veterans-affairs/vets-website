import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';
import { validateInitials } from '../helpers';

/**
 * A VaTextInputField that automatically capitalizes text on blur
 * and validates initials against first and last name from page 1
 * @param {WebComponentFieldProps} props
 */

export default function CapitalizedTextInputField(props) {
  const mappedProps = vaTextInputFieldMapping(props);
  const [displayValue, setDisplayValue] = useState(mappedProps.value || '');
  const [validationError, setValidationError] = useState('');

  const formData = useSelector(state => state.form?.data || {});

  const firstName = formData?.authorizedOfficial?.fullName?.first || '';
  const lastName = formData?.authorizedOfficial?.fullName?.last;

  const handleBlur = event => {
    const currentValue = event?.target?.value ?? displayValue;
    const capitalizedValue = currentValue.toUpperCase();

    const error = validateInitials(capitalizedValue, firstName, lastName);
    setValidationError(error);

    setDisplayValue(capitalizedValue);

    mappedProps.onBlur();
    mappedProps.onInput(event, capitalizedValue);
  };

  const handleInput = (event, value) => {
    const inputValue = value || event.target.value;
    setDisplayValue(inputValue);

    if (validationError) {
      setValidationError('');
    }

    mappedProps.onInput(event, value);
  };

  const { children, ...inputProps } = mappedProps;

  return (
    <div className={mappedProps.className}>
      {children}

      <VaTextInput
        {...inputProps}
        value={displayValue}
        onInput={handleInput}
        onBlur={handleBlur}
        error={validationError || mappedProps.error}
        label="Initial here"
        required={mappedProps.required}
      />
    </div>
  );
}
