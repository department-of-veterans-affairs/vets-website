import React, { useState } from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';

/**
 * A VaTextInputField that automatically capitalizes text on blur
 * @param {WebComponentFieldProps} props
 */

export default function CapitalizedTextInputField(props) {
  const mappedProps = vaTextInputFieldMapping(props);
  const [displayValue, setDisplayValue] = useState(mappedProps.value || '');

  const handleBlur = event => {
    const currentValue = event.target.value;
    const capitalizedValue = currentValue.toUpperCase();

    setDisplayValue(capitalizedValue);

    mappedProps.onBlur();
    mappedProps.onInput(event, capitalizedValue);
  };

  const handleInput = (event, value) => {
    const inputValue = value || event.target.value;
    setDisplayValue(inputValue);

    mappedProps.onInput(event, value);
  };

  return (
    <VaTextInput
      {...mappedProps}
      value={displayValue}
      onInput={handleInput}
      onBlur={handleBlur}
    />
  );
}
