import React from 'react';

export default function RadioWidget({
  options,
  value,
  disabled,
  onChange,
  id
}) {
  const { enumOptions, labels = {} } = options;
  return (
    <div>{
      enumOptions.map((option, i) => {
        const checked = option.value === value;
        return (
          <div className="form-radio-buttons" key={i}>
            <input type="radio"
                autoComplete="false"
                checked={checked}
                id={`${id}_${i}`}
                name={`${id}_${i}`}
                value={option.value}
                disabled={disabled}
                onChange={_ => onChange(option.value)}/>
            <label htmlFor={`${id}_${i}`}>
              {labels[option.value] || option.label}
            </label>
          </div>
        );
      })
    }</div>
  );
}
