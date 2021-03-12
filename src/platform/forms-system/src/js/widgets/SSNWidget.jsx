import React, { useState } from 'react';
import TextWidget from './TextWidget';

import { formatSSN } from 'platform/utilities/ui';

// We only want to mask the first 5 digits of a formatted SSN
// Anything longer than that should remain unmasked
const MASKED_LENGTH = 6;

/**
 * Mask a SSN, but leave the final sequence of digits visible (up to 4)
 */
function maskSSN(ssnString = '') {
  let prefix = '';
  let rest = '';

  const formattedSSN = formatSSN(ssnString);

  if (formattedSSN.length > MASKED_LENGTH) {
    // The number is long enough for us to have unmasked digits
    prefix = formattedSSN.slice(0, MASKED_LENGTH);
    rest = formattedSSN.slice(MASKED_LENGTH);
  } else {
    prefix = formattedSSN;
  }

  const masked = prefix.replace(/[0-9]/g, '●');
  return `${masked}${rest}`;
}

/*
 * Handles removing dashes from SSNs by keeping the user input in local state
 * and saving the transformed version instead
 */
export default function SSNWidget(props) {
  const [val, setVal] = useState(props.value);
  const [displayVal, setDisplayVal] = useState(props.value);

  const handleChange = value => {
    // If val is blank or undefined, pass undefined to onChange
    let strippedSSN;
    if (value) {
      strippedSSN = value.replace(/[- ]/g, '');
    }

    setVal(value);
    setDisplayVal(value);
    props.onChange(strippedSSN);
  };

  const handleBlur = () => {
    setDisplayVal(maskSSN(val));
  };

  const handleFocus = () => {
    setDisplayVal(val);
  };

  return (
    <TextWidget
      {...props}
      value={displayVal}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
}
