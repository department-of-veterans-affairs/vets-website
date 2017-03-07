import React from 'react';

export default function GenderWidget({
  id,
  value,
  disabled,
  onChange
}) {
  return (
    <div className="form-radio-buttons">
      <input type="radio"
          autoComplete="false"
          checked={value === 'Female'}
          id={`${id}Female`}
          name={`${id}Female`}
          value="Fs"
          disabled={disabled}
          onChange={_ => onChange(true)}/>
      <label htmlFor={`${id}Female`}>
        Female
      </label>
      <input type="radio"
          autoComplete="false"
          checked={value === 'Male'}
          id={`${id}Male`}
          name={`${id}Male`}
          value="M"
          disabled={disabled}
          onChange={_ => onChange(false)}/>
      <label htmlFor={`${id}Male`}>
        Male
      </label>
    </div>
  );
}
