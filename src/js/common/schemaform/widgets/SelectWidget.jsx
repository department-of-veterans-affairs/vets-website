import React from 'react';
import { asNumber } from 'react-jsonschema-form/lib/utils';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

function processValue({ type, items }, value) {
  if (value === '') {
    return undefined;
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

function getValue(event) {
  return event.target.value;
}

function SelectWidget({
  schema,
  id,
  options,
  value,
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
        value={value}
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
])(SelectWidget);
