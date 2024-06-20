import React, { useRef, useState } from 'react';
import { formatARN } from 'platform/utilities/ui';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';

/**
 * Mask an Alien Registration Number, but leave the final sequence of digits visible (up to 4)
 */
function maskARN(arnString = '') {
  const strippedARN = arnString.replace(/[- ]/g, '');
  const maskedARN = strippedARN.replace(/^\d{1,3}/, digit =>
    digit.replace(/\d/g, '●'),
  );

  return formatARN(maskedARN);
}

/**
 * Use a arnPattern instead of this.
 *
 * Examples:
 * ```
 * arnOnly: arnUI()
 * nonCitizenIds: arnOrVaFileNumberUI()
 * ```
 * @param {WebComponentFieldProps} props */
export default function ArnField(fieldProps) {
  const props = vaTextInputFieldMapping(fieldProps);

  const [val, setVal] = useState(props.value);
  const [displayVal, setDisplayVal] = useState(props.value);
  const vaTextInput = useRef();

  const handleChange = event => {
    const { value } = event.target;
    let strippedARN;
    if (value) {
      strippedARN = value.replace(/[- ]/g, '');
    }

    setVal(value);
    setDisplayVal(value);
    props.onInput(event, strippedARN);
  };

  const handleBlur = () => {
    setDisplayVal(maskARN(val));
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
