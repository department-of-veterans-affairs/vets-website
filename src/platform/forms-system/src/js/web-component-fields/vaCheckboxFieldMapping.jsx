import React from 'react';

export default function vaTextInputFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    label,
    required,
    error,
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
    ...uiOptions,
    name: childrenProps.idSchema.$id,
    label,
    // autocomplete: uiOptions?.autocomplete,
    required,
    error,
    maxlength: childrenProps.schema.maxLength,
    minlength: childrenProps.schema.minLength,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    // inputmode: uiOptions?.inputmode,
    type: inputType,
    // hint: uiOptions?.hint,
    vaChange: (event, value) => {
      const newVal = value ?? event.target.value ?? undefined;
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
