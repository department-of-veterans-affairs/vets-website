import React, { useState, useCallback } from 'react';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

export default function MaskedSSNWidget({ value, onChange, onBlur, ...props }) {
  const [visibleValue, setVisibleValue] = useState(value);

  const unmaskInput = useCallback(
    () => {
      setVisibleValue(value);
    },
    [setVisibleValue, value],
  );

  const maskInput = useCallback(
    event => {
      if (!value) {
        return;
      }
      const maskedValue = value.replace(/[0-9](?=.{4,}$)/g, '*');
      setVisibleValue(maskedValue);
      onBlur(event);
    },
    [setVisibleValue, onBlur, value],
  );

  const handleChange = useCallback(
    nextValue => {
      setVisibleValue(nextValue);
      onChange(nextValue);
    },
    [setVisibleValue],
  );

  return (
    <TextWidget
      {...props}
      value={visibleValue}
      onChange={handleChange}
      onBlur={maskInput}
      onFocus={unmaskInput}
    />
  );
}
