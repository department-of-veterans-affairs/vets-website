import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { COVID_FAQ_URL, NULL_CONDITION_STRING } from '../constants';
import DownloadLink from './DownloadLink';

export const contestedIssuesTitle = (
  <>
    <strong>Select the issue you would like to have reviewed</strong>
    <span className="schemaform-required-span vads-u-font-weight--normal vads-u-font-size--base">
      (*Required)
    </span>
  </>
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
  } = attributes;
  // May need to throw an error to Sentry if any of these doesn't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = Number.isInteger(ratingIssuePercentNumber);

  return (
    <div className="widget-content">
      <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
        {typeof ratingIssueSubjectText === 'string'
          ? ratingIssueSubjectText
          : NULL_CONDITION_STRING}
      </h3>
      <span>{description || ''}</span>
      {showPercentNumber && (
        <p>
          Current rating: <strong>{ratingIssuePercentNumber}%</strong>
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
        <strong>Note:</strong> If you weren’t able to request a timely review
        due to COVID-19 pandemic, we may grant you an extension of the deadline.
        To request an extension, <DownloadLink /> and attach a note that you’re
        requesting a filing extension due to COVID-19.
      </li>
      <li>
        Your issue isn’t related to monthly compensation, pension, or survivor
        benefits. For all other benefits, like health care, insurance or
        education, you’ll need to <DownloadLink /> and submit it by mail or in
        person.
      </li>
      <li>
        The issue or decision isn’t in our system yet. You’ll need to{' '}
        <DownloadLink /> and submit it by fax or mail.
      </li>
      <li>
        You’re applying for a benefit that another surviving dependent of the
        Veteran is also applying for. And by law, only 1 of you can receive the
        benefit. You’ll need to appeal to the Board of Veterans’ Appeals.
      </li>
      <li>
        You’re requesting a review of a Board of Veterans’ Appeals decision.
        You’ll need to refer to the Board’s decision notice for your review
        options.
      </li>
      <li>
        You’re requesting a review of another Higher-Level Review. You can
        either submit a supplmental claim or appeal to the Board of Veterans’
        Appeals.
      </li>
    </ul>
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
      <p>Your issue may not be eligible for a Higher-Level Review if:</p>
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
      content={`You need to choose the rated disability you’re requesting for a
        Higher-Level Review. We can’t process your request without a selected
        disability.`}
    />
  );
};
