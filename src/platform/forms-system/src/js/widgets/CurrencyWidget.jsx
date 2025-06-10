import React, { useState } from 'react';

export default function CurrencyWidget({
  id,
  disabled,
  options = {},
  value: propValue,
  onChange,
  onBlur,
}) {
  const [value, setValue] = useState(() => {
    let initialValue = propValue;
    if (typeof initialValue === 'number') {
      initialValue = initialValue.toFixed(2);
    }
    return initialValue;
  });

  const handleBlur = () => {
    onBlur(id);
  };

  const handleChange = event => {
    const val = event.target.value;
    if (val === '' || typeof val === 'undefined') {
      onChange();
      // Needs to look like a currency
    } else if (!/^\${0,1}[0-9,]*(\.\d{1,2})?$/.test(val)) {
      onChange(val);
    } else {
      // Needs to parse as a number
      const parsed = parseFloat(val.replace(/[^0-9.]/g, ''));
      if (!Number.isNaN(parsed)) {
        onChange(parsed);
      } else {
        onChange(val);
      }
    }
    setValue(val);
  };

  return (
    <input
      autoComplete={options.autocomplete}
      type="text"
      id={id}
      name={id}
      disabled={disabled}
      className={options.widgetClassNames}
      value={typeof value === 'undefined' ? '' : value}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
}
