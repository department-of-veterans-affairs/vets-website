import React, { useState } from 'react';
import TextWidget from './TextWidget';

/*
 * Handles removing dashes from SSNs by keeping the user input in local state
 * and saving the transformed version instead
 */
export default function SSNWidget(props) {
  const [val, setVal] = useState(props.value);

  const handleChange = value => {
    // If val is blank or undefined, pass undefined to onChange
    let strippedSSN;
    if (value) {
      strippedSSN = value.replace(/[- ]/g, '');
    }

    setVal(value);
    props.onChange(strippedSSN);
  };

  return <TextWidget {...props} value={val} onChange={handleChange} />;
}
