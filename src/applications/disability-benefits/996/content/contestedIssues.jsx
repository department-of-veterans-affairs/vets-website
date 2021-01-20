import React from 'react';
import moment from 'moment';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import {
  BOARD_APPEALS_URL,
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
    <legend name="eligibleScrollElement" className="vads-u-font-size--lg">
      Select the issue(s) you would like reviewed
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
      <span className="vads-u-font-weight--bold">
        {typeof ratingIssueSubjectText === 'string'
          ? ratingIssueSubjectText
          : NULL_CONDITION_STRING}
      </span>
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

const disabilitiesList = (
  <div>
    <p>Your issue may not be eligible for review if:</p>
    <ul>
      <li>
        We made the decision over a year ago. You have 1 year from the date on
        your decision letter to request a Higher-Level Review.{' '}
        <strong>Note:</strong> If you aren’t able to request a timely review due
        to COVID-19, we may grant you a deadline extension. To request an
        extension, fill out and submit VA Form 20-0996, with a note attached
        that you’re requesting an extension due to COVID-19.
      </li>
      <li>
        Your issue is for a benefit type other than compensation or pension. To
        request a Higher-Level Review for another benefit type, you’ll need to
        fill out VA Form 20-0996 and submit it by mail or in person.
      </li>
      <li>
        The issue or decision isn’t in our system yet. You’ll need to fill out
        VA Form 20-0996 and submit it by mail or in person.
      </li>
      <li>
        You and another surviving dependent of the Veteran are applying for the
        same benefit. And by law, only 1 of you can receive that benefit. You’ll
        need to{' '}
        <a href={BOARD_APPEALS_URL}>appeal to the Board of Veterans’ Appeals</a>
        .
      </li>
      <li>
        You’re requesting a review of a Board of Veterans’ Appeals decision.
        Refer to your decision notice for your options.
      </li>
      <li>
        You’re requesting a review of a Higher-Level Review decision. You’ll
        need to either file a Supplemental Claim or appeal to the Board of
        Veterans’ Appeals.
      </li>
    </ul>
    <p>
      <DownloadLink content={'Download VA Form 20-0996'} />
    </p>
    <p className="vads-u-margin-top--2p5">
      To learn more about how COVID-19 affect claims or appeals, please visit
      our <a href={COVID_FAQ_URL}>Coronavirus FAQ page</a>.
    </p>
    <p className="vads-u-padding-bottom--2p5">
      To learn more about decision review options, please visit our{' '}
      <a href={DECISION_REVIEWS_URL}>decision reviews and appeals</a>{' '}
      information page. You can call us at{' '}
      <Telephone contact={CONTACTS.VA_BENEFITS} /> or work with an accredited
      representative to{' '}
      <a href="/disability/get-help-filing-claim/">get help with your claim</a>.
    </p>
  </div>
);

export const disabilitiesExplanationAlert = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText={'Why isn’t my issue eligible?'}>
      {disabilitiesList}
    </AdditionalInfo>
  </>
);

export const disabilitiesExplanation = (
  <AdditionalInfo triggerText={'Don’t see the issue you’re looking for?'}>
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
