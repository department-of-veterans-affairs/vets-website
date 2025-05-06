import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';
import { parseNumber } from '../web-component-patterns/numberPattern';

export const CURRENCY_REGEXP = /^[0-9,]*(\.\d*)?$/;
export const CURRENCY_PATTERN = '^\\d*(\\.\\d{1,2})?$'; // for schemas

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

  const [displayVal, setDisplayVal] = useState(props.value);
  const className = `${props.class || ''} currency-field`;

  const handleInput = event => {
    const { value } = event.target;
    setDisplayVal(value);

    // Not using props.onInput because in the vaTextInputFieldMapping onInput
    // callback, it uses `value || event.target.value;` and sets the value to
    // undefined. I found that if you enter "--" in the input, the input will
    // highlight like there's an error, but no error message will show.
    // Returning null will show the error message
    if (value === '' || typeof value === 'undefined') {
      props.onChange();
      // Needs to look like a currency
    } else if (!CURRENCY_REGEXP.test(value)) {
      props.onChange(value);
    } else {
      // Needs to parse as a number
      const parsedValue = parseNumber(value);
      if (!isNaN(parsedValue)) {
        setDisplayVal(value);
        props.onChange(schemaType === 'number' ? parsedValue : value);
      } else {
        props.onChange(value);
      }
    }
  };

  const handleBlur = event => {
    const { value } = event.target;
    setDisplayVal(value);
    props.onBlur(props.name);
    // Needs to parse as a number
    const parsedValue = parseNumber(value);
    if (!isNaN(parsedValue)) {
      const roundedValue = Math.round(parsedValue * 100) / 100;
      const roundedString = roundedValue.toFixed(2);
      setDisplayVal(roundedString);
      props.onChange(schemaType === 'number' ? roundedValue : roundedString);
    } else {
      props.onChange(value);
    }
  };

  const handleFocus = () => {
    setDisplayVal(
      typeof props.value === 'number' ? props.value.toFixed(2) : props.value,
    );
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
      onInput={handleInput}
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
