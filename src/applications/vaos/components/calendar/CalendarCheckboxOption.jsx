import React from 'react';

const CalendarCheckboxOption = ({
  index,
  fieldName,
  value,
  checked,
  onChange,
  label,
}) => (
  <div className="vaos-calendar__option vads-u-display--flex vads-u-border--1px vads-u-justify-content--center vads-u-align-items--center vads-u-padding-y--1 vads-u-padding-x--0 vads-u-margin-right--1 vads-u-margin-bottom--1 vads-u-border-color--primary">
    <input
      id={`checkbox-${index}`}
      type="checkbox"
      name={fieldName}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label
      className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
      htmlFor={`checkbox-${index}`}
    >
      {label}
    </label>
  </div>
);

export default CalendarCheckboxOption;
