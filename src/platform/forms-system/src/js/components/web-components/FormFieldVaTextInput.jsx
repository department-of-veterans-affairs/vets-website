import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function(props) {
  const {
    textDescription,
    showLabel,
    label,
    required,
    error,
    DescriptionField,
    uiOptions,
    index,
    description,
    childrenProps,
    help,
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
      label={showLabel && label}
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
      // inputmode
      type={inputType}
      // success
      // pattern
      // message-aria-describedby
      hint={help.props.help}
      // invalid
      // uswds
      onInput={event =>
        childrenProps.onChange(
          event.target.value ? event.target.value : undefined,
        )
      }
      onBlur={() => childrenProps.onBlur(childrenProps.idSchema.$id)}
    >
      {DescriptionField && (
        <DescriptionField options={uiOptions} index={index} />
      )}
      {!textDescription && !DescriptionField && description}
    </VaTextInput>
  );
}
