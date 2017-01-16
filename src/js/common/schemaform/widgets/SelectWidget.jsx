import React from 'react';
import { asNumber } from 'react-jsonschema-form/lib/utils';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

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

function SelectWidget({
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
        autoFocus={autofocus || false}
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

export default onlyUpdateForKeys([
  'id',
  'value',
  'schema',
  'required'
])(SelectWidget);
