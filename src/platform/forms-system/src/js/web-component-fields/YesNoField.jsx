import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaRadioFieldMapping from './vaRadioFieldMapping';

export default function YesNoField(props) {
  const mappedProps = vaRadioFieldMapping(props);

  const labels = mappedProps.uiOptions?.labels || {};

  const values = {
    Y: true,
    N: false,
  };

  return (
    <VaRadio
      {...mappedProps}
      value={props.childrenProps.schema.default || null}
      onVaValueChange={event => {
        const value = values[event.detail.value];
        const newVal = value ?? undefined;
        props.childrenProps.onChange(newVal);
      }}
    >
      <va-radio-option
        name={props.childrenProps.idSchema.$id}
        key={`${props.childrenProps.idSchema.$id}Yes`}
        id={`${props.childrenProps.idSchema.$id}Yes`}
        value="Y"
        label={labels.Y || 'Yes'}
        uswds={mappedProps?.uswds}
        tile={props.uiOptions?.tile}
      />
      <va-radio-option
        name={props.childrenProps.idSchema.$id}
        key={`${props.childrenProps.idSchema.$id}No`}
        id={`${props.childrenProps.idSchema.$id}No`}
        value="N"
        label={labels.N || 'No'}
        uswds={mappedProps?.uswds}
        tile={props.uiOptions?.tile}
      />
    </VaRadio>
  );
}
