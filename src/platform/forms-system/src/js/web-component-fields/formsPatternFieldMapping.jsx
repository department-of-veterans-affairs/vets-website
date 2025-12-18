import React from 'react';

/** @param {WebComponentFieldProps} props */
export default function formsPatternFieldMapping(props) {
  const { uiOptions = {} } = props;
  const {
    useFormsPattern,
    formHeading,
    formHeadingLevel,
    formDescription,
  } = uiOptions;
  let formsPatternProps = {};
  let formDescriptionSlot = null;

  if (
    !useFormsPattern &&
    (formHeading || formHeadingLevel || formDescription)
  ) {
    throw new Error(
      '`useFormsPattern` must set when using `formHeading`, `formHeadingLevel`, `formDescription`',
    );
  }

  if (useFormsPattern) {
    if (useFormsPattern !== 'single' && useFormsPattern !== 'multiple') {
      throw new Error('`useFormsPattern` must set to "single" or "multiple"');
    }

    formsPatternProps = {
      useFormsPattern,
      formHeading,
      formHeadingLevel,
    };

    formDescriptionSlot = formDescription && (
      <div slot="form-description">
        {typeof formDescription === 'function'
          ? React.createElement(formDescription)
          : formDescription}
      </div>
    );
  }

  return { formsPatternProps, formDescriptionSlot };
}
