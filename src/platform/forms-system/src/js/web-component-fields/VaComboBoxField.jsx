// @ts-check
import React from 'react';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaSelectAndComboBoxFieldMapping from './vaSelectAndComboBoxFieldMapping';

export default function VaComboBoxField(props) {
  const mappedProps = vaSelectAndComboBoxFieldMapping(props);

  // return an option
  function getOption(option, key) {
    return (
      <option key={key} value={option.value}>
        {option.label}
      </option>
    );
  }

  // return the optgroup with options
  function getOptGroup(option, key) {
    return (
      <optgroup key={key} label={option.optionGroup}>
        {option.options.map((opt, j) => getOption(opt, `${key}-${j}`))}
      </optgroup>
    );
  }

  return (
    <VaComboBox
      {...mappedProps}
      placeholder={props?.uiOptions?.placeholder || null}
      value={
        props.childrenProps.formData ??
        props.childrenProps.schema.default ??
        undefined
      }
    >
      {props.childrenProps.schema._options.map(
        (option, i) =>
          option.optionGroup ? getOptGroup(option, i) : getOption(option, i),
      )}
    </VaComboBox>
  );
}
