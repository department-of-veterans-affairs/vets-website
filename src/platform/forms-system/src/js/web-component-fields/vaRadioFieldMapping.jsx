import React from 'react';
import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';

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

  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  return {
    ...commonFieldMapping(props),
    ...formsPatternProps,
    description: textDescription,
    value:
      typeof childrenProps.formData === 'undefined'
        ? false
        : childrenProps.formData,
    headerAriaDescribedby: uiOptions?.headerAriaDescribedby,
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <>
        {formDescriptionSlot}
        {/* known a11y issue: this will not be read out */}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };
}
