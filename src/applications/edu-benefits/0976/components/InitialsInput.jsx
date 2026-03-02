import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';

export default function InitialsInput(props) {
  const mappedProps = vaTextInputFieldMapping(props);

  // custom onInput handler to make sure initials always appear as uppercase
  function onInput(event, value) {
    let newVal = value || event.target.value;
    newVal = newVal === '' ? undefined : newVal.toUpperCase();
    mappedProps.onChange(newVal);
  }
  return <VaTextInput {...mappedProps} onInput={onInput} />;
}
