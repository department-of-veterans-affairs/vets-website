import React from 'react';
import moment from 'moment';

import { getIssueName, getIssueDate } from '../utils/helpers';
import { FORMAT_YMD, FORMAT_READABLE } from '../../shared/constants';

export const missingAreaOfDisagreementErrorMessage =
  'Please choose or enter a reason for disagreement';

const titlePrefix = 'Disagreement with';
const titleConnector = ' decision on ';

/**
 * Title for review & submit page, text string returned
 * @param {*} data - item data (contestable issue or added issue)
 * @returns {String} - ObjectField error if not a string
 */
export const getIssueTitle = data => {
  const date = moment(getIssueDate(data), FORMAT_YMD).format(FORMAT_READABLE);
  return (
    <>
      {titlePrefix}{' '}
      <span className="dd-privacy-hidden">{getIssueName(data)}</span>
      {titleConnector}
      <span className="dd-privacy-hidden">{date}</span>
    </>
  );
};

// formContext.pagePerItemIndex is undefined here? Use index added to data :(
export const issueName = ({ formData, formContext } = {}) => {
  const index = formContext.pagePerItemIndex || formData.index;
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/27096
  const Header = formContext.onReviewPage ? 'h4' : 'h3';
  return (
    <legend
      className="schemaform-block-title schemaform-title-underline"
      aria-describedby={`area-of-disagreement-label-${index}`}
    >
      <Header id="disagreement-title" className="vads-u-margin-top--0">
        {getIssueTitle(formData)}
      </Header>
    </legend>
  );
};

// Error revealed through CSS (need to verify this works for screenreaders)
// "hidden" class uses an !important flag, so we're using "hide" here
export const issusDescription = ({ formContext }) => {
  const { pagePerItemIndex, submitted } = formContext;

  // submitted may be an array (until this bug is fixed)
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1639684843152000
  const hasSubmitted = Array.isArray(submitted) || submitted;

  // adding data-submitted attribute; updating the class name outside of React
  // breaks the areaOfDisagreementWorkAround
  return (
    <div
      key={pagePerItemIndex}
      id={`area-of-disagreement-label-${pagePerItemIndex}`}
      className="area-of-disagreement-label vads-u-font-size--base vads-u-font-weight--normal"
      data-submitted={hasSubmitted}
    >
      Tell us what you disagree with. You can choose more than one.
      <span className="vads-u-font-weight--normal schemaform-required-span">
        (*Required)
      </span>
      <p>I disagree with this:</p>
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

export const titles = {
  serviceConnection: 'The service connection',
  effectiveDate: 'The effective date of award',
  evaluation: 'Your evaluation of my condition',
  otherEntry: 'Something else:',
};

// Includes _{index} which is appended by the TextWidget
export const otherDescription = ({ index }) => (
  <div
    id={`other_hint_text_${index}`}
    className="vads-u-color--gray hide-on-review"
  >
    Please explain in a few words
  </div>
);

// Only show set values (ignore false & undefined)
export const AreaOfDisagreementReviewField = ({ children }) => {
  const { formData, name } = children?.props || {};
  return formData ? (
    <div className="review-row">
      <dt>{titles[name]}</dt>
      <dd className={name === 'otherEntry' ? 'dd-privacy-hidden' : ''}>
        {children}
      </dd>
    </div>
  ) : null;
};
