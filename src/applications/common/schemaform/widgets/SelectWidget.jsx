import React from 'react';
import _ from 'lodash/fp';
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

function getOptions(enumOptions, labels) {
  return enumOptions.map((option, i) => {
    return <option key={i} value={option.value}>{labels[option.value] || option.label}</option>;
  });
}

function getGroup(group, enumOptions, labels, groups) {
  const groupedLabels = Object.values(labels).filter(label => groups[label.value] === group.name);
  const groupedOptions = Object.values(enumOptions).filter(enumOption => groups[enumOption.value] === group.name);
  const children = getOptions(groupedOptions, groupedLabels);

  return (
    <optgroup key={group.index} label={group.name}>
      {children}
    </optgroup>
  );
}

function getOptionList(enumOptions, labels, groups) {
  const uniqueGroups = Object.values(groups).reduce((acc, item) => {
    if (acc.indexOf(item) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);

  if (groups) {
    return uniqueGroups.map((group, index) => getGroup({ name: group, index }, enumOptions, labels, groups));
  }
  return getOptions(enumOptions, labels);
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
  placeholder
}) {
  const { enumOptions, labels = {}, groups = {} } = options;
  return (
    <select
      id={id}
      name={id}
      multiple={multiple}
      className={options.widgetClassNames}
      value={value || ''}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      onBlur={(event) => {
        const newValue = getValue(event, multiple);
        onBlur(id, processValue(schema, newValue));
      }}
      onChange={(event) => {
        const newValue = getValue(event, multiple);
        onChange(processValue(schema, newValue));
      }}>
      {!schema.default && <option value="">{placeholder}</option>}
      {getOptionList(enumOptions, labels, groups)}</select>
  );
}

export default onlyUpdateForKeys([
  'id',
  'value',
  'schema',
])(SelectWidget);
