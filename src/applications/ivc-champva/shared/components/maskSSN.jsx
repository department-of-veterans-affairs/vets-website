import { formatSSN } from 'platform/utilities/ui';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export function maskSSN(ssnString = '') {
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
  const [cleared, setCleared] = useState(false);
  const vaTextInput = useRef();

  useEffect(() => {
    setDisplayVal(maskSSN(val));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = event => {
    const { value } = event.target;
    let strippedSSN;
    if (value) {
      strippedSSN = value.replace(/[- ]/g, '');
    }
    if (val === '') {
      setCleared(true);
      setDisplayVal(val);
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
    if (cleared) {
      setDisplayVal(val);
    }
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

HandlePrefilledSSN.propTypes = {
  id: PropTypes.number,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onInput: PropTypes.func,
};
