import React from 'react';
import { asNumber } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

function processValue({ type }, value) {
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
  onChange,
  onBlur,
  placeholder,
}) {
  const { enumOptions, labels = {} } = options;
  return (
    <select
      id={id}
      name={id}
      multiple={multiple}
      className={`${options.widgetClassNames} ${
        disabled ? 'vads-u-background-color--gray-lighter' : ''
      }`}
      value={value || ''}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      onBlur={event => {
        // eslint-disable-next-line sonarjs/no-extra-arguments
        const newValue = getValue(event, multiple);
        onBlur(id, processValue(schema, newValue));
      }}
      onChange={event => {
        // eslint-disable-next-line sonarjs/no-extra-arguments
        const newValue = getValue(event, multiple);
        onChange(processValue(schema, newValue));
      }}
    >
      {!schema.default && <option value="">{placeholder}</option>}
      {enumOptions.map((option, i) => (
        <option key={i} value={option.value}>
          {labels[option.value] || option.label}
        </option>
      ))}
      )}
    </select>
  );
}

export default onlyUpdateForKeys(['id', 'value', 'schema'])(SelectWidget);
