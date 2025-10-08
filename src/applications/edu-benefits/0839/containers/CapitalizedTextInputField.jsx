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
    const lettersOnlyPattern = /^[A-Za-z]+$/;
    if (!lettersOnlyPattern.test(initials)) {
      return 'Please enter your initials using letters only';
    }

    const firstName = formData?.authorizedOfficial?.fullName?.first || '';

    const lastName1 = formData?.authorizedOfficial?.fullName?.last;
    let lastName2;

    const hyphenIndex = lastName1.indexOf('-');
    if (hyphenIndex !== -1) {
      lastName2 = lastName1.substring(hyphenIndex + 1);
    }

    const firstLetter = firstName.charAt(0).toUpperCase();
    const lastLetter1 = lastName1.charAt(0).toUpperCase();
    const lastLetter2 = lastName2?.charAt(0).toUpperCase();

    const inputFirst = initials.charAt(0);
    const inputSecond = initials.charAt(1);

    if (inputFirst !== firstLetter || inputSecond !== lastLetter1) {
      return `Initials must match your name: ${firstName} ${lastName1}`;
    }

    if (initials.length === 3) {
      const inputThird = initials.charAt(2);

      if (inputThird !== lastLetter2) {
        return `Initials must match your name: ${firstName} ${lastName1}`;
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
