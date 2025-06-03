import React from 'react';
import { formatSSN } from 'platform/utilities/ui';

/**
 * Mask a SSN, but leave the final sequence of digits visible (up to 4)
 * @param {string} ssnString - The SSN string to mask
 * @returns {string} The masked SSN string
 */
export function maskSSN(ssnString = '') {
  try {
    const strippedSSN = ssnString.replace(/[- ]/g, '');
    const maskedSSN = strippedSSN.replace(/^\d{1,5}/, digit =>
      digit.replace(/\d/g, '●'),
    );

    return formatSSN(maskedSSN);
  } catch {
    return ssnString;
  }
}

/**
 * Strip non-numeric characters from a value
 * @param {string} value - The value to strip
 * @returns {string|undefined} The stripped value or undefined if empty
 */
export function stripNonNumeric(value) {
  if (!value) return undefined;
  return value.replace(/[- ]/g, '');
}

/**
 * Custom hook for managing masked input state and handlers
 * @param {Object} props - Component props containing value, onChange, onBlur, id
 * @param {Object} options - Configuration options
 * @param {boolean} options.maskOnBlur - Whether to mask on blur (default: true)
 * @param {function} options.maskFunction - Function to use for masking (default: maskSSN)
 * @param {function} options.shouldMask - Function to determine if masking should occur
 * @returns {Object} State and handlers for masked input
 */
export function useMaskedInput(props, options = {}) {
  const {
    maskOnBlur = true,
    maskFunction = maskSSN,
    shouldMask = () => true,
  } = options;

  const [val, setVal] = React.useState(props.value);
  const [displayVal, setDisplayVal] = React.useState(
    maskOnBlur && props.value ? maskFunction(props.value) : props.value,
  );

  const handleChange = value => {
    const strippedValue = stripNonNumeric(value);

    setVal(value);
    setDisplayVal(value);
    props.onChange(strippedValue);
  };

  const handleBlur = () => {
    if (maskOnBlur && shouldMask(val)) {
      setDisplayVal(maskFunction(val));
    }
    if (props.onBlur) {
      props.onBlur(props.id);
    }
  };

  const handleFocus = () => {
    setDisplayVal(val);
  };

  return {
    displayValue: displayVal,
    handlers: {
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
  };
}
