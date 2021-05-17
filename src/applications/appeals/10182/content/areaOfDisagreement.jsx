import React from 'react';

import { getIssueName } from '../utils/helpers';

export const missingAreaOfDisagreementErrorMessage =
  'Please choose an area of disagreement';
export const missingAreaOfDisagreementOtherErrorMessage =
  'Please enter a reason for disagreement';

export const issueName = ({ formData } = {}) => (
  <legend
    className="schemaform-block-title schemaform-title-underline"
    aria-describedby="area-of-disagreement-label"
  >
    {getIssueName(formData)}
  </legend>
);

// Error revealed through CSS (need to verify this works for screenreaders)
// "hidden" class uses an !important flag, so we're using "hide" here
export const issusDescription = () => (
  <div
    id="area-of-disagreement-label"
    className="vads-u-font-size--base vads-u-font-weight--normal"
  >
    Please specify the area(s) of disagreement for this issue:
    <span className="vads-u-font-weight--normal schemaform-required-span">
      (*Required)
    </span>
    <span
      className="usa-input-error-message hide"
      role="alert"
      id="error-message"
    >
      <span className="sr-only">Error</span>
      {missingAreaOfDisagreementErrorMessage}
    </span>
  </div>
);

export const serviceConnection = 'I disagree with the service connection';
export const effectiveDate = 'I disagree with the effective date of award';
export const evaluation = 'I disagree with the evaluation of the disability';
export const other = 'Other reason';

export const otherLabel = 'Please specify';
