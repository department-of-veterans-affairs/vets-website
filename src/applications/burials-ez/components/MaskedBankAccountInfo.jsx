import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';
import { maskBankInformation } from '../utils/helpers';

/**
 * Mask bank information for display while preserving original values
 * @param {Object} fieldProps - The field props provided by the forms system
 * @returns {JSX.Element} - Masked bank account input component
 */
export default function MaskedBankAccountInfo(fieldProps) {
  const props = vaTextInputFieldMapping(fieldProps);
  const [val, setVal] = useState(props.value || '');
  const [displayVal, setDisplayVal] = useState(props.value || '');
  const [isPrefilled] = useState(!!props.value);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const vaTextInput = useRef();

  useEffect(() => {
    if (props.value) {
      // Only mask if it's pre-filled data and user hasn't started typing
      if (isPrefilled && !isUserTyping) {
        setDisplayVal(maskBankInformation(props.value, 4));
      } else {
        setDisplayVal(props.value);
      }
    }
  }, [props.value, isPrefilled, isUserTyping]);

  const handleChange = event => {
    const { value } = event.target;

    setVal(value);
    setIsUserTyping(true);
    setDisplayVal(value);

    props.onInput(event, value);
  };

  const handleBlur = () => {
    if (isPrefilled && isUserTyping && val) {
      setDisplayVal(maskBankInformation(val, 4));
    }
    props.onBlur(props.id);
  };

  const handleFocus = () => {
    setDisplayVal(val);
  };

  return (
    <VaTextInput
      {...props}
      value={displayVal}
      onInput={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      ref={vaTextInput}
    />
  );
}

MaskedBankAccountInfo.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onInput: PropTypes.func,
};
