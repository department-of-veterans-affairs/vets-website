import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';

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

  const validateInitials = initials => {
    if (!initials || initials.length === 0) {
      return '';
    }

    const firstName = formData?.authorizedOfficial?.fullName?.first || '';
    const lastName = formData?.authorizedOfficial?.fullName?.last || '';

    const firstLetter = firstName.charAt(0).toUpperCase();
    const lastLetter = lastName.charAt(0).toUpperCase();

    if (initials.length === 2) {
      const inputFirst = initials.charAt(0);
      const inputSecond = initials.charAt(1);

      if (inputFirst !== firstLetter || inputSecond !== lastLetter) {
        return `Initials must match your name: ${firstLetter}${lastLetter}`;
      }
    } else if (initials.length === 3) {
      const inputFirst = initials.charAt(0);
      const inputThird = initials.charAt(2);

      if (inputFirst !== firstLetter || inputThird !== lastLetter) {
        return `Initials must match your name: ${firstLetter}${lastLetter}`;
      }
    }

    return '';
  };

  const handleBlur = event => {
    const currentValue = event.target.value;
    const capitalizedValue = currentValue.toUpperCase();

    const error = validateInitials(capitalizedValue);
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

  return (
    <VaTextInput
      {...mappedProps}
      value={displayValue}
      onInput={handleInput}
      onBlur={handleBlur}
      error={validationError || mappedProps.error}
    />
  );
}
