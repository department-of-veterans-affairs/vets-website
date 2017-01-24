import React from 'react';

export default function RadioWidget({
  options,
  value,
  disabled,
  onChange
}) {
  // Generating a unique field name to identify this set of radio buttons
  const name = Math.random().toString();
  const { enumOptions } = options;
  return (
    <div>{
      enumOptions.map((option, i) => {
        const checked = option.value === value;
        return (
          <div className="form-radio-buttons" key={i}>
            <input type="radio"
                autoComplete="false"
                checked={checked}
                id={name}
                name={name}
                value={option.value}
                disabled={disabled}
                onChange={_ => onChange(option.value)}/>
            <label htmlFor={`${name}-${i}`}>
              {option.label}
            </label>
          </div>
        );
      })
    }</div>
  );
}
