import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FORM_URL, NULL_CONDITION_STRING } from '../constants';

export const contestedIssuesTitle = (
  <strong>Select the issue(s) you would like to contest</strong>
);

/**
 * @typedef {Object} Disability
 * @property {String} diagnosticCode
 * @property {String} name
 * @property {String} ratingPercentage
 * @param {Disability} disability
 */
export const disabilityOption = ({ name, description, ratingPercentage }) => {
  // May need to throw an error to Sentry if any of these doesn't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showRatingPercentage = Number.isInteger(ratingPercentage);

  return (
    <div className="widget-content">
      <h4 className="vads-u-margin-top--0">
        {typeof name === 'string' ? name : NULL_CONDITION_STRING}
      </h4>
      <span>{description}</span>
      {showRatingPercentage && (
        <p>
          Current rating: <strong>{ratingPercentage}%</strong>
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
          decision letter about what form you’ll need to submit to request a
          Higher-Level Review.
          <p>
            <a
              href="/disability/view-disability-rating/rating"
              className="usa-button usa-button-secondary btn-see-all-issues"
            >
              See all your issues
            </a>
          </p>
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
