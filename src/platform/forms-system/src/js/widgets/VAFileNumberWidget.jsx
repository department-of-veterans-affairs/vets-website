import React, { useState } from 'react';
import { formatSSN } from 'platform/utilities/ui';
import TextWidget from './TextWidget';

/**
 * Mask a SSN, but leave the final sequence of digits visible (up to 4)
 */
function maskSSN(ssnString = '') {
  const strippedSSN = ssnString.replace(/[- ]/g, '');
  const maskedSSN = strippedSSN.replace(/^\d{1,5}/, digit =>
    digit.replace(/\d/g, '●'),
  );

  return formatSSN(maskedSSN);
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
    let strippedVal;
    if (value) {
      strippedVal = value.replace(/[- ]/g, '');
    }

    setVal(value);
    setDisplayVal(value);
    props.onChange(strippedVal);
  };

  const handleBlur = () => {
    const strippedVal = val.replace(/[- ]/g, '');

    if (strippedVal.length === 9) {
      setDisplayVal(maskSSN(val));
    }
    props.onBlur(props.id);
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
