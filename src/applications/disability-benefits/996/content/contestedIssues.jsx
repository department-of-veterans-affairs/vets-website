import React from 'react';
import moment from 'moment';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { COVID_FAQ_URL, NULL_CONDITION_STRING } from '../constants';
import DownloadLink from './DownloadLink';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const ContestedIssuesTitle = props =>
  props?.formData?.contestedIssues?.length === 0 ? (
    <h2 className="vads-u-font-size--h4">
      Sorry, we couldn’t find any contested issues
    </h2>
  ) : (
    <legend>
      <strong className="vads-u-font-size--lg">
        Select the issue(s) you would like to contest
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

const disabilitiesList = (
  <div>
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
        The issue or decision isn’t our system yet. You’ll need to fill VA Form
        20-0996 and submit it by mail or in person.
      </li>
      <li>
        You and another surviving dependent of the Veteran are applying for the
        same benefit. And by law, only 1 of you can receive that benefit. You’ll
        need to{' '}
        <a href="/decision-reviews/board-appeal/">
          appeal to the Board of Veterans’ Appeals
        </a>
        .
      </li>
      <li>
        You’re requesting a review of a Board of Veterans’ Appeals decision.
        Refer to the Board’s decision notice for your options.
      </li>
      <li>
        You’re requesting a review of a Higher-Level Review decision. You’ll
        need to either file a Supplemental Claim or appeal to the Board of
        Veterans’ Appeals.
      </li>
    </ul>
    <DownloadLink content={'Download VA Form 20-0996'} />
    <p>
      To learn more about how COVID-19 affects claims or appeals, please visit
      our <a href={COVID_FAQ_URL}>Coronavirus FAQ page</a>.
    </p>
  </div>
);

export const disabilitiesExplanationAlert = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText={'Why isn’t my issue eligible?'}>
      <p>Your issue may not be eligible if:</p>
      {disabilitiesList}
    </AdditionalInfo>
  </>
);

export const disabilitiesExplanation = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText={'Don’t see the issue you’re looking for?'}>
      <p>
        There are many reasons a decision might not appear in the list above.
      </p>
      {disabilitiesList}
    </AdditionalInfo>
  </>
);

/**
 * Shows the alert box only if the form has been submitted
 */
export const contestedIssuesAlert = ({ formContext }) => {
  if (!formContext.submitted) return null;
  return (
    <AlertBox
      status="error"
      className="contested-issues-error vads-u-margin-top--1"
      headline="Please choose a disability"
      content={`You need to choose a rated disability before we can process your
        request for a Higher-Level Review.`}
    />
  );
};
