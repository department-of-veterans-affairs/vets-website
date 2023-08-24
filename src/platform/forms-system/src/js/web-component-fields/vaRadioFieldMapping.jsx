import React from 'react';
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaRadioFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  return {
    ...commonFieldMapping(props),
    description: textDescription,
    value:
      typeof childrenProps.formData === 'undefined'
        ? false
        : childrenProps.formData,
    labelHeaderLevel: uiOptions?.labelHeaderLevel,
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <div slot="description">
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </div>
    ),
  };
}
