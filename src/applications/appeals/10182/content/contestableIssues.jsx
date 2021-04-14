import React from 'react';
import { format } from 'date-fns';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

// import { scrollTo } from '../helpers';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const EligibleIssuesTitle = props =>
  props?.formData?.contestedIssues?.length === 0 ? (
    <h2 className="vads-u-font-size--h4" name="eligibleScrollElement">
      Sorry, we couldn’t find any eligible conditions
    </h2>
  ) : (
    <legend name="eligibleScrollElement" className="vads-u-font-size--lg">
      Please select the condition(s) you would like to have reviewed
      <span className="schemaform-required-span vads-u-font-weight--normal vads-u-font-size--base">
        (*Required)
      </span>
    </legend>
  );

export const EligibleIssuesDescription = (
  <>
    <div>
      <p className="vads-u-margin-top--0">
        These issues are in your VA record. If an issue is missing from this
        list, you can add it by clicking the <strong>Add condition</strong>{' '}
        button (NOT YET IMPLEMENTED).
      </p>
    </div>
    <AdditionalInfo triggerText={'Why don’t I see my issue here?'}>
      It’s possible the issue or decision isn’t in our system yet. This can
      happen if it’s a more recent claim decision and is still being processed
      in another system, or if the information hasn’t been sent to va.gov as of
      yet. If you don’t see the issue you wish to have reviewed, please click
      the “add issue” button below to add it manually.
    </AdditionalInfo>
  </>
);

export const NewIssueDescription = (
  <span className="vads-u-font-weight--normal">
    Add an issue and our decision date on this issue. You can find the decision
    date on your decision notice (the letter you got in the mail from us).
  </span>
);

/**
 * @typedef {Object} Disability
 * @property {String} diagnosticCode
 * @property {String} issue
 * @property {String} percentNumber
 * @param {Disability} disability
 */
export const DisabilityCard = ({ attributes }) => {
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
      <span className="vads-u-font-weight--bold">{ratingIssueSubjectText}</span>
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
          <strong>
            {format(new Date(approxDecisionDate), 'MMMM d, yyyy')}
          </strong>
        </p>
      )}
    </div>
  );
};

export const MissingIssueExplanationAlert = (
  <p className="vads-u-margin-top--2p5">xx</p>
);
