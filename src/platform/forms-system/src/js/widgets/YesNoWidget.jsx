import React from 'react';

export default function YesNoWidget({
  id,
  value,
  disabled,
  onChange,
  options = {},
}) {
  const { yesNoReverse = false, labels = {}, widgetProps = {} } = options;
  const yesValue = !yesNoReverse;
  const noValue = !yesValue;
  return (
    <div className="form-radio-buttons">
      <input
        type="radio"
        checked={value === yesValue}
        id={`${id}Yes`}
        name={`${id}`}
        value="Y"
        disabled={disabled}
        onChange={_ => onChange(yesValue)}
        {...widgetProps.Y || {}}
      />
      <label htmlFor={`${id}Yes`}>{labels.Y || 'Yes'}</label>
      <input
        type="radio"
        checked={value === noValue}
        id={`${id}No`}
        name={`${id}`}
        value="N"
        disabled={disabled}
        onChange={_ => onChange(noValue)}
        {...widgetProps.N || {}}
      />
      <label htmlFor={`${id}No`}>{labels.N || 'No'}</label>
    </div>
  );
}
