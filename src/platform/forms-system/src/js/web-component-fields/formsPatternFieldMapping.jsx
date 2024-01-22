import React from 'react';

/** @param {WebComponentFieldProps} props */
export default function formsPatternFieldMapping(props) {
  const { uiOptions } = props;
  let formsPatternProps = {};

  if (uiOptions?.useFormsPattern) {
    formsPatternProps = {
      useFormsPattern: uiOptions?.useFormsPattern,
      formHeading: uiOptions?.formHeading,
      formHeadingLevel: uiOptions?.formHeadingLevel,
    };
  }

  const formDescriptionSlot = uiOptions?.formDescription && (
    <div slot="form-description">{uiOptions.formDescription}</div>
  );

  return { formsPatternProps, formDescriptionSlot };
}
