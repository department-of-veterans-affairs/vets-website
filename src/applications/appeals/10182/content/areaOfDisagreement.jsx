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

const titles = {
  serviceConnection: 'The service connection',
  effectiveDate: 'The effective date of award',
  evaluation: 'The evaluation of my condition',
  other: 'Something else',
};

const headerClasses = [
  'vads-u-display--inline-block',
  'vads-u-font-size--base',
  'vads-u-font-family--sans',
  'vads-u-font-weight--normal',
  'vads-u-margin-y--0',
].join(' ');

const wrapHeader = text => <h3 className={headerClasses}>{text}</h3>;

export const serviceConnection = wrapHeader(titles.serviceConnection);
export const effectiveDate = wrapHeader(titles.effectiveDate);
export const evaluation = wrapHeader(titles.evaluation);
export const other = wrapHeader(titles.other);
export const otherLabel = 'Tell us what you disagree with:';
// Includes _{index} which is appended by the TextWidget
export const otherDescription = ({ index }) => (
  <div
    id={`other_hint_text_${index}`}
    className="vads-u-color--gray hide-on-review"
  >
    Please explain in a few words
  </div>
);

export const AreaOfDisagreementReviewField = ({ children }) =>
  children?.props.formData ? (
    <div className="review-row">
      <dt>
        <h5 className={headerClasses}>{titles[children.props.name]}</h5>
      </dt>
      <dd>{children}</dd>
    </div>
  ) : null;
