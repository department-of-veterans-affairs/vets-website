import React from 'react';
import TextWidget from './TextWidget';
import { useMaskedInput, stripNonNumeric } from '../utilities/masking';

/*
 * Handles removing dashes from VA file numbers by keeping the user input in local state
 * and saving the transformed version instead. Only masks when length is exactly 9 digits.
 */
export default function VAFileNumberWidget(props) {
  const shouldMask = val => {
    const stripped = stripNonNumeric(val);
    return stripped && stripped.length === 9;
  };

  const { displayValue, handlers } = useMaskedInput(props, { shouldMask });

  return <TextWidget {...props} value={displayValue} {...handlers} />;
}
