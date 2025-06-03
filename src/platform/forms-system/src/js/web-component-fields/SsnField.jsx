import React, { useRef } from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';
import { useMaskedInput } from '../utilities/masking';

// Re-export maskSSN for backward compatibility
export { maskSSN } from '../utilities/masking';

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
  const vaTextInput = useRef();
  const className = `${props.class || ''} masked-ssn`;

  // Create custom handlers for VaTextInput that use onInput instead of onChange
  const maskedInput = useMaskedInput({
    ...props,
    onChange: value => props.onInput({ target: { value } }, value),
  });

  const handleInput = event => {
    maskedInput.handlers.onChange(event.target.value);
  };

  return (
    <VaTextInput
      {...props}
      class={className}
      value={maskedInput.displayValue}
      onInput={handleInput}
      onBlur={maskedInput.handlers.onBlur}
      onFocus={maskedInput.handlers.onFocus}
      ref={vaTextInput}
    />
  );
}
