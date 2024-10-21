import React from 'react';

import { capitalizeEachWord } from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

/**
 * @typedef {Object} Disability
 * @property {String} diagnosticCode
 * @property {String} name
 * @property {String} ratingPercentage
 * @property {String} maximumRatingPercentage
 * @param {Disability} disability
 */
export const disabilityOption = ({
  name,
  ratingPercentage,
  className,
  maximumRatingPercentage,
}) => {
  // May need to throw an error to Sentry if any of these doesn't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showRatingPercentage = Number.isInteger(ratingPercentage);
  const isAtMaxRating =
    (Number.isInteger(ratingPercentage) && ratingPercentage === 100) ||
    (Number.isInteger(maximumRatingPercentage) &&
      maximumRatingPercentage === ratingPercentage);
  return (
    <>
      <h3 className={`vads-u-font-size--h4 ${className}`}>
        {typeof name === 'string'
          ? capitalizeEachWord(name)
          : NULL_CONDITION_STRING}
      </h3>
      {showRatingPercentage && (
        <p>
          Current rating: <strong>{ratingPercentage}%</strong>
        </p>
      )}
      {isAtMaxRating && (
        <p>You’re already at the maximum rating for this disability.</p>
      )}
    </>
  );
};

export const disabilitiesClarification = (
  <p>
    <strong>Note:</strong> This list only includes disabilities that we’ve
    already rated. It doesn’t include any conditions from claims that are in
    progress.
  </p>
);

/**
 * Shows the alert box only if the form has been submitted
 */
export const ratedDisabilitiesAlert = ({ formContext }) => {
  if (!formContext.submitted) return null;
  return (
    <va-alert status="error" uswds>
      <h3 slot="headline">We need you to add a disability</h3>
      <p className="vads-u-font-size--base">
        You’ll need to add a new disability or choose a rated disability to
        claim. We can’t process your claim without a disability selected.
      </p>
    </va-alert>
  );
};
