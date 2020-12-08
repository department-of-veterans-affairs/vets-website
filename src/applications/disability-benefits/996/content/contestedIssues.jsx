import React from 'react';
import moment from 'moment';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import {
  BOARD_APPEALS_URL,
  CLAIM_STATUS_TOOL_URL,
  COVID_FAQ_URL,
  DECISION_REVIEWS_URL,
  NULL_CONDITION_STRING,
} from '../constants';
import DownloadLink from './DownloadLink';
import { scrollTo } from '../helpers';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const ContestedIssuesTitle = props =>
  props?.formData?.contestedIssues?.length === 0 ? (
    <h2 className="vads-u-font-size--h4" name="eligibleScrollElement">
      Sorry, we couldn’t find any eligible issues
    </h2>
  ) : (
    <legend name="eligibleScrollElement">
      <strong className="vads-u-font-size--lg">
        Select the issue(s) you would like reviewed
      </strong>
      <span className="schemaform-required-span vads-u-font-weight--normal vads-u-font-size--base">
        (*Required)
      </span>
    </legend>
  );

/**
 * @typedef {Object} Disability
 * @property {String} diagnosticCode
 * @property {String} issue
 * @property {String} percentNumber
 * @param {Disability} disability
 */
export const disabilityOption = ({ attributes }) => {
  const {
    ratingIssueSubjectText,
    description,
    ratingIssuePercentNumber,
    approxDecisionDate,
  } = attributes;
  // May need to throw an error to Sentry if any of these don't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = (ratingIssuePercentNumber || '') !== '';

  return (
    <div className="widget-content">
      <h3 className="vads-u-margin-y--0 vads-u-font-size--h4">
        {typeof ratingIssueSubjectText === 'string'
          ? ratingIssueSubjectText
          : NULL_CONDITION_STRING}
      </h3>
      {description && (
        <p className="vads-u-margin-bottom--0">{description || ''}</p>
      )}
      {showPercentNumber && (
        <p className="vads-u-margin-bottom--0">
          Current rating: <strong>{ratingIssuePercentNumber}%</strong>
        </p>
      )}
      {approxDecisionDate && (
        <p>
          Decision date:{' '}
          <strong>{moment(approxDecisionDate).format('MMM D, YYYY')}</strong>
        </p>
      )}
    </div>
  );
};

const leadInContent = (
  <>
    <p className="vads-u-margin-top--2p5">
      Please refer to your decision notice for further information on decision
      review options and HLR eligibility. For information on how COVID-19
      affects claims and appeals, please visit our{' '}
      <a href={COVID_FAQ_URL}>Coronavirus FAQ page</a>.
    </p>
    <h2 className="vads-u-font-size--h4">
      Where can I find more information on review options?
    </h2>
    <p>
      Information regarding review options can be found at our{' '}
      <a href={DECISION_REVIEWS_URL}>decision review information page</a>, or
      you can call us at <Telephone contact={CONTACTS.VA_BENEFITS} />.
      Alternatively, you can work with an accredited representative to get help
      filing a claim for disability compensation.
    </p>
  </>
);

// Wrapped in a <div> on purpose
const disabilitiesList = (
  <div>
    <ul>
      <li>
        VA decided that issue more than one year ago (an HLR can only be
        requested within one year of the last decision). The one year time
        period from the date on your decision letter has expired for
        Higher-Level Review. <strong>Note:</strong> If you weren’t able to
        request a timely review due to the COVID-19 pandemic, we may grant you
        an extension of the deadline. To request an extension, download and fill
        out VA Form 20-0996 PDF (1.5MB), and attach a note that you’re
        requesting a filing extension due to COVID-19.
      </li>
      <li>
        Your issue isn’t related to monthly compensation, pension or survivor
        benefits. For all other benefits, like health care, insurance or
        education, you’ll need to download and fill out VA Form 20-0996 PDF
        (1.5MB) and submit it by mail or in person.
      </li>
      <li>
        The VA has not yet reached a decision on this claim. Please refer to the{' '}
        <a href={CLAIM_STATUS_TOOL_URL}>Claims Status Tool</a> for more
        information.
      </li>
      <li>
        The issue or decision isn’t in our system yet. You’ll need to download
        and fill out VA Form 20-0996 PDF (1.5MB) and submit it by mail.
      </li>
      <li>
        You’re applying for a benefit that another surviving dependent of the
        Veteran is also applying for. And by law, only 1 of you can receive that
        benefit. You’ll need to{' '}
        <a href={BOARD_APPEALS_URL}>appeal to the Board of Veterans’ Appeals</a>
        .
      </li>
      <li>
        You’re requesting a review of a Board of Veterans’ Appeals decision or
        an existing decision already under Higher-Level Review. You’ll need to
        refer to the Board’s decision notice for your review options.
      </li>
      <li>
        You’re requesting a review of a Higher-Level Review decision. You can
        either submit a Supplemental Claim or appeal to the Board of Veterans’
        Appeals.
      </li>
      <li>VA has not previously made a decision on that issue.</li>
      <li>
        The issue is ineligible under a Higher-Level Review (it cannot be
        requested on contested claims, such as disagreements with attorney
        fees).
      </li>
    </ul>
    <p className="vads-u-padding-bottom--2p5">
      <DownloadLink content={'Download VA Form 20-0996'} />
    </p>
  </div>
);

export const disabilitiesExplanationAlert = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText={'Why isn’t my issue eligible?'}>
      {leadInContent}
      <p>Your issue may not be eligible if:</p>
      {disabilitiesList}
    </AdditionalInfo>
  </>
);

export const disabilitiesExplanation = (
  <AdditionalInfo triggerText={'Don’t see the issue you’re looking for?'}>
    {leadInContent}
    <p>There are many reasons a decision might not appear in the list above.</p>
    {disabilitiesList}
  </AdditionalInfo>
);

/**
 * Shows the alert box only if the form has been submitted
 */
export const ContestedIssuesAlert = ({ className }) => {
  setTimeout(() => scrollTo('eligibleScrollElement'), 300);
  return (
    <AlertBox
      status="error"
      className={`eligible-issues-error vads-u-margin-x--2 vads-u-margin-y--1 vads-u-padding-x--3 vads-u-padding-y--2 ${className}`}
      headline="Please choose an eligible issue so we can process your request"
    />
  );
};
