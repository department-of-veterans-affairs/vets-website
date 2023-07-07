import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaRadioFieldMapping from './vaRadioFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function YesNoField(props) {
  const mappedProps = vaRadioFieldMapping(props);

  const labels = props.uiOptions?.labels || {};

  const yesNoReverse = props.uiOptions?.yesNoReverse || false;

  const values = {
    Y: !yesNoReverse,
    N: yesNoReverse,
  };

  const selectedValue =
    props.childrenProps.formData ?? props.childrenProps.schema.default ?? null;

  return (
    <VaRadio
      {...mappedProps}
      onVaValueChange={event => {
        const value = values[event.detail.value];
        const newVal = value ?? undefined;
        if (mappedProps.enableAnalytics) {
          // Implement enableAnalytics if needed here, likely using recordEvent
        }
        props.childrenProps.onChange(newVal);
      }}
    >
      <va-radio-option
        name={props.childrenProps.idSchema.$id}
        key={`${props.childrenProps.idSchema.$id}Yes`}
        id={`${props.childrenProps.idSchema.$id}Yes`}
        value="Y"
        checked={selectedValue === values.Y}
        label={labels.Y || 'Yes'}
        uswds={mappedProps?.uswds}
        tile={props.uiOptions?.tile}
      />
      <va-radio-option
        name={props.childrenProps.idSchema.$id}
        key={`${props.childrenProps.idSchema.$id}No`}
        id={`${props.childrenProps.idSchema.$id}No`}
        value="N"
        checked={selectedValue === values.N}
        label={labels.N || 'No'}
        uswds={mappedProps?.uswds}
        tile={props.uiOptions?.tile}
      />
    </VaRadio>
  );
}
