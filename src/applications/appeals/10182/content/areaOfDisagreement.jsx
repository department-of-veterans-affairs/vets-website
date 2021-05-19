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
      Please specify the area(s) of disagreement for this issue:
      <span className="vads-u-font-weight--normal schemaform-required-span">
        (*Required)
      </span>
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

export const serviceConnection = 'I disagree with the service connection';
export const effectiveDate = 'I disagree with the effective date of award';
export const evaluation = 'I disagree with the evaluation of the disability';
export const other = 'Other reason';

export const otherLabel = 'Please specify';
