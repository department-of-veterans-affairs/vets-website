import React, { useState, useCallback } from 'react';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

export default function MaskedSSNWidget({ value, onChange, ...props }) {
  const [visibleValue, setVisibleValue] = useState(value);

  const onFocus = useCallback(
    () => {
      setVisibleValue(value);
    },
    [setVisibleValue, value],
  );

  const onBlur = useCallback(
    () => {
      if (!value) {
        return;
      }
      const maskedValue = value.replace(/[0-9](?=.{4,}$)/g, '*');
      setVisibleValue(maskedValue);
    },
    [setVisibleValue, value],
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
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}
