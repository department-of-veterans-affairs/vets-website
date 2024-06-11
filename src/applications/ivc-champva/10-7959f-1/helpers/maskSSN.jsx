import { formatSSN } from 'platform/utilities/ui';
import React, { useState, useEffect, useRef } from 'react';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function maskSSN(ssnString = '') {
  const strippedSSN = ssnString.replace(/[- ]/g, '');
  const maskedSSN = strippedSSN.replace(/^\d{1,5}/, digit =>
    digit.replace(/\d/g, '●'),
  );
  return formatSSN(maskedSSN);
}

/**
 * @param {WebComponentFieldProps} props */
export default function HandlePrefilledSSN(fieldProps) {
  const props = vaTextInputFieldMapping(fieldProps);
  const [val, setVal] = useState(props.value);
  const [displayVal, setDisplayVal] = useState(props.value);
  const vaTextInput = useRef();

  useEffect(() => {
    setVal(maskSSN(val));
    setDisplayVal(maskSSN(val));
  }, []);
  const handleChange = event => {
    const { value } = event.target;
    let strippedSSN;
    if (value) {
      strippedSSN = value.replace(/[- ]/g, '');
    }

    setVal(value);
    setDisplayVal(value);
    props.onInput(event, strippedSSN);
  };

  const handleBlur = () => {
    setDisplayVal(maskSSN(val));
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
