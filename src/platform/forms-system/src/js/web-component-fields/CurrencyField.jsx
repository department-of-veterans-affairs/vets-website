import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';

export function coerceStringValue(possibleString) {
  return typeof possibleString !== 'string'
    ? possibleString.toString()
    : possibleString;
}

export function parseCurrencyString(currencyString = '') {
  const stringValue = coerceStringValue(currencyString);
  const value = parseFloat(stringValue.replace(/[^\d.-]/g, ''));
  if (isNaN(value)) {
    return undefined;
  }
  return value;
}

/*
- [ ] Test with min & max values
- [ ] Update unit tests (are there any for web component patterns?!)
*/

/**
 * Use a currencyPattern instead of this.
 *
 * Examples:
 * ```
 * income: currencyUI()
 * ```
 * @param {WebComponentFieldProps} props */
export default function CurrencyField(fieldProps) {
  const props = vaTextInputFieldMapping(fieldProps);

  const [val, setVal] = useState(parseCurrencyString(props.value));
  const [displayVal, setDisplayVal] = useState(props.value);
  const vaTextInput = useRef();
  const className = `${props.class || ''} currency-field`;

  const handleChange = event => {
    const { value } = event.target;
    const parsedValue = parseCurrencyString(value);
    setVal(parsedValue);
    setDisplayVal(value);
    // Not using props.onInput because in the vaTextInputFieldMapping onInput
    // callback, it uses `value || event.target.value;` and sets the value to
    // undefined. I found that if you enter "--" in the input, the input will
    // highlight like there's an error, but no error message will show.
    // Returning null will show the error message
    props.onChange(typeof parsedValue === 'undefined' ? null : parsedValue);
  };

  const handleBlur = () => {
    setDisplayVal(val);
    props.onBlur(props.id);
  };

  const handleFocus = () => {
    setDisplayVal(val);
  };

  return (
    <VaTextInput
      {...props}
      currency
      type="text"
      inputMode="text"
      class={className}
      value={displayVal}
      onInput={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      ref={vaTextInput}
    />
  );
}

CurrencyField.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  class: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
