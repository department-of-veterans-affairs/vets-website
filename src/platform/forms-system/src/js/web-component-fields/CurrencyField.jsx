import React, { useState } from 'react';
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
  return Math.round(value * 100) / 100;
}

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
  const { uiOptions } = fieldProps;
  const schemaType = fieldProps.childrenProps?.schema.type || 'number';

  const [val, setVal] = useState(parseCurrencyString(props.value));
  const [displayVal, setDisplayVal] = useState(props.value);
  const className = `${props.class || ''} currency-field`;

  const handleChange = event => {
    const { value } = event.target;
    const parsedValue = parseCurrencyString(value);
    setVal(parsedValue);
    setDisplayVal(value);
    const dataValue = schemaType === 'number' ? parsedValue : value;

    // Not using props.onInput because in the vaTextInputFieldMapping onInput
    // callback, it uses `value || event.target.value;` and sets the value to
    // undefined. I found that if you enter "--" in the input, the input will
    // highlight like there's an error, but no error message will show.
    // Returning null will show the error message
    props.onChange(typeof parsedValue === 'undefined' ? null : dataValue);
  };

  const handleBlur = () => {
    setDisplayVal(val);
    props.onBlur(props.name);
  };

  const handleFocus = () => {
    setDisplayVal(val);
  };

  // Not using currency property because inside the web component, it switches
  // inputmode to numeric and adds a invalid number error message, but the error
  // message isn't rendered! See https://github.com/department-of-veterans-affairs/va.gov-team/issues/106934#issuecomment-2806489322
  // Using inputPrefix instead
  return (
    <VaTextInput
      {...props}
      // currency
      inputPrefix={uiOptions?.currencySymbol || '$'}
      type="text"
      inputmode="text"
      class={className}
      value={displayVal}
      showInputError
      onInput={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
}

CurrencyField.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  class: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
