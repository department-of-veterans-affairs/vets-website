import React from 'react';
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaMemorableDateFieldMapping(props) {
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
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    'month-select': uiOptions?.monthSelect ?? true,
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
