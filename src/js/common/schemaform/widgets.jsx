import React from 'react';

/*
 * These are widgets that will override the default ones for reat-jsonschema-form
 */

export function TextWidget(props) {
  return (
    <input type={props.schema.type === 'number' ? 'number' : props.type}
        id={props.id}
        disabled={props.disabled}
        maxLength={props.schema.maxLength}
        autoComplete={props.options.autocomplete || false}
        className={props.options.widgetClassNames}
        value={props.value || ''}
        onBlur={() => props.onBlur(props.id)}
        onChange={(event) => props.onChange(event.target.value ? event.target.value : undefined)}/>
  );
}

TextWidget.defaultProps = {
  type: 'text'
};

export function EmailWidget(props) {
  return <TextWidget type="email" {...props}/>;
}

export function RadioWidget({
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
