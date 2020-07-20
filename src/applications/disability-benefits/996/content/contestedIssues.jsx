import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FORM_URL, COVID_FAQ_URL, NULL_CONDITION_STRING } from '../constants';

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

const downloadLink = (
  <a
    href={FORM_URL}
    download="VBA-20-0996-ARE.pdf"
    title="download Decision Review Request: Higher-Level Review PDF"
    type="application/pdf"
  >
    <i
      aria-hidden="true"
      className="fas fa-download vads-u-padding-right--0p5"
      role="img"
    />
    download Decision Review Request: Higher-Level Review{' '}
    <dfn>
      <abbr title="Portable Document Format">PDF</abbr> (VA Form 20-0996, 1.5
      <abbr title="Megabytes">MB</abbr>)
    </dfn>
  </a>
);

const disabilitiesList = (
  <ul>
    <li>
      We made the decision over a year ago. You have 1 year from the date on
      your decision letter to request a Higher-Level Review.
    </li>
    <li>
      Your issue is for a benefit type other than compensation or pension. To
      request a Higher-Level Review for another benefit type like health care,
      insurance, or education, you'll need to {downloadLink}, fill out and
      submit it by mail or in person.
    </li>
    <li>
      The issue or decision isn’t in our system yet. Please refer to your
      decision letter about what form you'll need to submit to request a
      Higher-Level Review.
    </li>
    <li>
      You’re unable to request a Higher-Level Review within 1 year from the date
      on your decision letter due to the COVID-19 pandemic. To request a good
      cause extension, you'll need to {downloadLink}, fill out and attach a note
      to your application that you’re requesting an exemption for timely filing
      due to COVID-19.
      <br />
      <br />
      To learn more about how COVID-19 affect claims or appeals, please visit
      our <a href={COVID_FAQ_URL}>Coronavirus FAQ page</a>.
    </li>
  </ul>
);

export const disabilitiesExplanationAlert = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText={'Why isn’t my issue eligible?'}>
      Your issue may not be eligible for a Higher-Level Review if:
      {disabilitiesList}
    </AdditionalInfo>
  </>
);

export const disabilitiesExplanation = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText={'Don’t see the issue you’re looking for?'}>
      Your issue may not be eligible for a Higher-Level Review if:
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
