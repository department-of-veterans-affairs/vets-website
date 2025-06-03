import React from 'react';
import TextWidget from './TextWidget';
import { useMaskedInput } from '../utilities/masking';

/*
 * Handles removing dashes from SSNs by keeping the user input in local state
 * and saving the transformed version instead
 */
export default function SSNWidget(props) {
  const { displayValue, handlers } = useMaskedInput(props);

  return <TextWidget {...props} value={displayValue} {...handlers} />;
}
