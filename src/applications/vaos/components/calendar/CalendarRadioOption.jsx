import React from 'react';

const CalendarRadioOption = ({
  id,
  fieldName,
  value,
  checked,
  onChange,
  label,
}) => (
  <div className="vaos-calendar__option vaos-calendar__option--radio">
    <input
      id={`radio-${id}`}
      type="radio"
      name={fieldName}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label
      className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
      htmlFor={`radio-${id}`}
    >
      <span aria-hidden="true">{label}</span>
      <span className="vads-u-visibility--screen-reader">
        {label} option selected
      </span>
    </label>
  </div>
);

export default CalendarRadioOption;
