import React from 'react';

const CalendarCheckboxOption = ({
  id,
  fieldName,
  value,
  checked,
  onChange,
  label,
}) => (
  <div className="vaos-calendar__option">
    <input
      id={`checkbox-${id}`}
      type="checkbox"
      name={fieldName}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label
      className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
      htmlFor={`checkbox-${id}`}
    >
      {label}
    </label>
  </div>
);

export default CalendarCheckboxOption;
