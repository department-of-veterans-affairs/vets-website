import React from 'react';

import { getIssueName } from '../utils/helpers';

export const missingAreaOfDisagreementErrorMessage =
  'Please choose an area of disagreement';
export const missingAreaOfDisagreementOtherErrorMessage =
  'Please enter a reason for disagreement';

// formContext.pagePerItemIndex is undefined here? Use index added to data :(
export const issueName = ({ formData, formContext } = {}) => {
  const index = formContext.pagePerItemIndex || formData.index;
  return (
    <legend
      className="schemaform-block-title schemaform-title-underline"
      aria-describedby={`area-of-disagreement-label-${index}`}
    >
      {getIssueName(formData)}
    </legend>
  );
};

// Error revealed through CSS (need to verify this works for screenreaders)
// "hidden" class uses an !important flag, so we're using "hide" here
export const issusDescription = ({ formContext }) => {
  const { pagePerItemIndex, submitted } = formContext;
  // adding data-submitted attribute; updating the class name outside of React
  // breaks the areaOfDisagreementWorkAround
  return (
    <div
      key={pagePerItemIndex}
      id={`area-of-disagreement-label-${pagePerItemIndex}`}
      className="area-of-disagreement-label vads-u-font-size--base vads-u-font-weight--normal"
      data-submitted={submitted}
    >
      Tell us why you disagree with our decision. You can choose more than one.
      <span className="vads-u-font-weight--normal schemaform-required-span">
        (*Required)
      </span>
      <p>I disagree with:</p>
      <span
        className="usa-input-error-message"
        role="alert"
        id={`error-message-${pagePerItemIndex}`}
      >
        <span className="sr-only">Error</span>
        {missingAreaOfDisagreementErrorMessage}
      </span>
    </div>
  );
};

export const serviceConnection = 'The service connection';
export const effectiveDate = 'The effective date of award';
export const evaluation = 'The evaluation of my condition';
export const other = 'Something else';

export const otherLabel = 'Tell us what you disagree with:';
