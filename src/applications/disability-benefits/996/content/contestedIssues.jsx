import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FORM_URL, NULL_CONDITION_STRING } from '../constants';

export const contestedIssuesTitle = (
  <>
    <strong>Select the issue(s) you would like to contest</strong>
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

export const disabilitiesExplanation = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <AdditionalInfo triggerText="Don’t see the issue you’re looking for?">
      There are several reasons your issue or decision might not appear in the
      list above:
      <ul>
        <li>
          If we made the decision over a year ago, it’s not eligible for a
          Higher-Level Review.
        </li>
        <li>
          The decision might be for another benefit type, like health care,
          insurance, or education. Decisions for these benefit types won’t
          appear on this list. If you want to request Higher-Level Review for
          benefit types other than compensation, you’ll need to fill out a{' '}
          <a href={FORM_URL}>
            Decision Review Request: Higher-Level Review (VA Form 20-0996)
          </a>
          .
        </li>
        <li>
          The issue or decision might not be in our system. Please refer to your
          decision letter about what form you’ll need to submit.
        </li>
        <li>
          If you were unable to file a Higher-Level Review claim before the
          deadline and need to request an extension based on good cause, you’ll
          need to fill out a paper{' '}
          <a href={FORM_URL}>
            VA Form 20-0996, Decision Review Request: Higher-Level Review
          </a>{' '}
          with your request for an extension.
        </li>
      </ul>
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
