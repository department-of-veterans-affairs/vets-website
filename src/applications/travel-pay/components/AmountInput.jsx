import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function AmountInput({ label = 'Amount', onChange }) {
  const [value, setValue] = useState('');
  const [currentLabel, setCurrentLabel] = useState(label);

  useEffect(
    () => {
      setCurrentLabel(label);
    },
    [label],
  );

  const handleChange = e => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d.]/g, '');
    setValue(cleaned);
    if (onChange) {
      onChange(cleaned === '' ? null : parseFloat(cleaned));
    }
  };

  const handleBlur = () => {
    if (value && !value.includes('.')) {
      const withDecimal = `${value}.00`;
      setValue(withDecimal);
      if (onChange) {
        onChange(parseFloat(withDecimal));
      }
    }
  };

  return (
    <div className="travel-pay-amount-input">
      <label className="">{currentLabel}</label>
      <input
        type="text"
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="usa-input"
      />
    </div>
  );
}

AmountInput.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.object,
};
