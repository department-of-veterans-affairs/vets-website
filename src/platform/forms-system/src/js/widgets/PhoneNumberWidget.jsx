import React, { useState, useEffect } from 'react';
import TextWidget from './TextWidget';

/*
 * Handles removing dashes, parentheses, and the letter `x` from phone numbers
 * by keeping the user input in local state and saving the transformed version
 * instead
 */
export default function PhoneNumberWidget(props) {
  const [val, setVal] = useState(props.value);
  const [firstUpdate, setFirstUpdate] = useState(true);

  const handleChange = newVal => {
    let stripped;
    if (newVal) {
      stripped = newVal.replace(/[^0-9]/g, '');
    }

    setVal(newVal);
    setFirstUpdate(false);
    props.onChange(stripped);
  };

  useEffect(
    () => {
      if (firstUpdate && props.value !== val) {
        handleChange(props.value);
      }
    },
    [props.value, val, firstUpdate, handleChange],
  );

  return (
    <TextWidget
      {...props}
      type="tel"
      autocomplete="tel"
      value={val}
      onChange={handleChange}
    />
  );
}
