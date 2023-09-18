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

  const inputmode = uiOptions?.inputmode === 'decimal' ? 'decimal' : 'numeric';

  return {
    ...commonFieldMapping(props),
    autocomplete:
      childrenProps.uiSchema['ui:autocomplete'] || uiOptions?.autocomplete,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    inputmode,
    // min: uiOptions?.min, // enable if / when supported for v3
    // max: uiOptions?.max, // enable if / when supported for v3
    width: uiOptions?.width,
    currency: uiOptions?.currency,
    onInput: (event, value) => {
      // redux value or input value
      let newVal = value || event.target.value;
      // pattern validation will trigger if you have '',
      // so set as undefined instead.
      newVal = newVal === '' ? undefined : newVal;
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
