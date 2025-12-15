import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaRadioFieldMapping from './vaRadioFieldMapping';

/**
 * Use yes no pattern instead.
 *
 * Examples:
 * ```
 * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
 * hasHealthInsurance: yesNoUI({
 *    title: 'Do you have health insurance coverage?'
 *    labels: {
 *      Y: 'Yes, I have health insurance',
 *      N: 'No, I do not have health insurance',
 *    },
 *    descriptions: {
 *      Y: 'Select this if you currently have any form of health insurance coverage',
 *      N: 'Select this if you do not have health insurance coverage',
 *    },
 * })
 * ```
 * @param {WebComponentFieldProps} props
 */
export default function YesNoField(props) {
  const mappedProps = vaRadioFieldMapping(props);

  const labels = props.uiOptions?.labels || {};
  const descriptions = props.uiOptions?.descriptions || {};

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
        props.childrenProps.onChange(newVal);
      }}
    >
      {mappedProps?.children}
      <va-radio-option
        name={props.childrenProps.idSchema.$id}
        key={`${props.childrenProps.idSchema.$id}Yes`}
        id={`${props.childrenProps.idSchema.$id}Yes`}
        value="Y"
        checked={selectedValue === values.Y}
        label={labels.Y || 'Yes'}
        {...descriptions.Y && { description: descriptions.Y }}
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
        {...descriptions.N && { description: descriptions.N }}
        uswds={mappedProps?.uswds}
        tile={props.uiOptions?.tile}
      />
    </VaRadio>
  );
}
