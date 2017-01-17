import React from 'react';
import { asNumber } from 'react-jsonschema-form/lib/utils';

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

function processValue({ type, items }, value) {
  if (type === 'array' && items && ['number', 'integer'].includes(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

function getValue(event, multiple) {
  let newValue;
  if (multiple) {
    newValue = [].filter.call(
      event.target.options, o => o.selected).map(o => o.value);
  } else {
    newValue = event.target.value;
  }

  return newValue;
}

export function SelectWidget({
  schema,
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  multiple,
  autofocus,
  onChange,
  onBlur
}) {
  const { enumOptions } = options;
  return (
    <select
        id={id}
        multiple={multiple}
        className={options.widgetClassNames}
        value={value}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autofocus}
        onBlur={(event) => {
          const newValue = getValue(event, multiple);
          onBlur(id, processValue(schema, newValue));
        }}
        onChange={(event) => {
          const newValue = getValue(event, multiple);
          onChange(processValue(schema, newValue));
        }}>
      {enumOptions.map(({ val, label }, i) => {
        return <option key={i} value={val}>{label}</option>;
      })
    }</select>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};
