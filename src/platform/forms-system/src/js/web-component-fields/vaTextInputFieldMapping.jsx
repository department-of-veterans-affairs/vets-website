import React from 'react';
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaTextInputFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  let inputType = uiOptions?.inputType;
  if (!inputType) {
    inputType = ['number', 'integer'].includes(childrenProps.schema.type)
      ? 'number'
      : 'text';
  }

  return {
    ...commonFieldMapping(props),
    autocomplete:
      childrenProps.uiSchema['ui:autocomplete'] || uiOptions?.autocomplete,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    type: inputType,
    width: uiOptions?.width,
    onInput: (event, value) => {
      // redux value or input value
      let newVal = value || event.target.value;
      // pattern validation will trigger if you have '',
      // so set as undefined instead.
      newVal = newVal === '' ? undefined : newVal;
      if (uiOptions.enableAnalytics) {
        // Implement enableAnalytics if needed here, likely using recordEvent
      }
      childrenProps.onChange(newVal);
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <>
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };
}
