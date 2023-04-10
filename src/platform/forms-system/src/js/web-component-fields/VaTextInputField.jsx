import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function VaTextInputField(props) {
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

  return (
    <VaTextInput
      name={childrenProps.idSchema.$id}
      label={label}
      autocomplete={uiOptions?.autocomplete}
      required={required}
      error={error}
      maxlength={childrenProps.schema.maxLength}
      minlength={childrenProps.schema.minLength}
      value={
        typeof childrenProps.formData === 'undefined'
          ? ''
          : childrenProps.formData
      }
      inputmode={uiOptions?.inputmode}
      type={inputType}
      hint={uiOptions?.hint}
      onInput={event =>
        childrenProps.onChange(
          event.target.value ? event.target.value : undefined,
        )
      }
      onBlur={() => childrenProps.onBlur(childrenProps.idSchema.$id)}
    >
      {textDescription && <p>{textDescription}</p>}
      {DescriptionField && (
        <DescriptionField options={uiOptions} index={index} />
      )}
      {!textDescription && !DescriptionField && description}
    </VaTextInput>
  );
}
