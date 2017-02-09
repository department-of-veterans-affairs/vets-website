import React from 'react';
import { asNumber } from 'react-jsonschema-form/lib/utils';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

function processValue({ type, items }, value) {
  if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value === '' ? undefined : value;
}

function getValue(event) {
  return event.target.value;
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
  onBlur,
  placeholder
}) {
  const { enumOptions } = options;
  return (
    <select
        id={id}
        multiple={multiple}
        className={options.widgetClassNames}
        value={value || ''}
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
      <option value="">{placeholder}</option>
      {enumOptions.map((option, i) => {
        return <option key={i} value={option.value}>{option.label}</option>;
      })
    }</select>
  );
}

export default onlyUpdateForKeys([
  'id',
  'value',
  'schema',
])(SelectWidget);
