import React from 'react';
import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';

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

  const commonFieldProps = commonFieldMapping(props);
  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  return {
    ...commonFieldProps,
    ...formsPatternProps,
    autocomplete:
      childrenProps.uiSchema['ui:autocomplete'] || uiOptions?.autocomplete,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    type: inputType,
    width: uiOptions?.width,
    charcount: uiOptions?.charcount,
    onInput: (event, value) => {
      // redux value or input value.
      let newVal = value || event.target.value;
      // always a string onChange - converts to integer to validate if using number pattern
      if (['number', 'integer'].includes(inputType)) {
        newVal = Number(newVal);
      }
      // pattern validation will trigger if you have '',
      // so set as undefined instead.
      newVal = newVal === '' ? undefined : newVal;
      childrenProps.onChange(newVal);
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <>
        {formDescriptionSlot}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };
}
