import React from 'react';

export default function YesNoWidget({
  id,
  value,
  disabled,
  onChange
}) {
  return (
    <div className="form-radio-buttons">
      <input type="radio"
          autoComplete="false"
          checked={value === true}
          id={`${id}Yes`}
          name={`${id}Yes`}
          value="Y"
          disabled={disabled}
          onChange={_ => onChange(true)}/>
      <label htmlFor={`${id}Yes`}>
        Yes
      </label>
      <input type="radio"
          autoComplete="false"
          checked={value === false}
          id={`${id}No`}
          name={`${id}No`}
          value="N"
          disabled={disabled}
          onChange={_ => onChange(false)}/>
      <label htmlFor={`${id}No`}>
        No
      </label>
    </div>
  );
}
