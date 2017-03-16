import React from 'react';

export default function RadioWidget({
  options,
  value,
  disabled,
  onChange,
  id
}) {
  const { enumOptions, labels = {}, nestedContent = {} } = options;

  // nested content could be a component or just jsx/text
  let content = nestedContent[value];
  if (typeof content === 'function') {
    const NestedContent = content;
    content = <NestedContent/>;
  }
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
            {checked && <div className="schemaform-radio-indent">{content}</div>}
          </div>
        );
      })
    }</div>
  );
}
