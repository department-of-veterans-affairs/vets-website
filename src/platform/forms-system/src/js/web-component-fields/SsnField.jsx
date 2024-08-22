import React, { useRef, useState } from 'react';
import { formatSSN } from 'platform/utilities/ui';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';

/**
 * Mask a SSN, but leave the final sequence of digits visible (up to 4)
 */
function maskSSN(ssnString = '') {
  const strippedSSN = ssnString.replace(/[- ]/g, '');
  const maskedSSN = strippedSSN.replace(/^\d{1,5}/, digit =>
    digit.replace(/\d/g, '●'),
  );

  return formatSSN(maskedSSN);
}

/**
 * Use a ssnPattern instead of this.
 *
 * Examples:
 * ```
 * ssnOnly: ssnUI()
 * veteranIds: ssnOrVaFileNumberUI()
 * ```
 * @param {WebComponentFieldProps} props */
export default function SsnField(fieldProps) {
  const props = vaTextInputFieldMapping(fieldProps);

  const [val, setVal] = useState(props.value);
  const [displayVal, setDisplayVal] = useState(props.value);
  const vaTextInput = useRef();
  const className = `${props.class || ''} masked-ssn`;

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
      class={className}
      value={displayVal}
      onInput={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      ref={vaTextInput}
    />
  );
}
