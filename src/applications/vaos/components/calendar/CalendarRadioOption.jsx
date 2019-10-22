import React from 'react';

const CalendarRadioOption = ({
  index,
  fieldName,
  value,
  checked,
  onChange,
  label,
}) => (
  <div className="vaos-calendar__option">
    <input
      id={`radio-${index}`}
      type="radio"
      name={fieldName}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label
      className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
      htmlFor={`radio-${index}`}
    >
      {label}
    </label>
  </div>
);

export default CalendarRadioOption;
