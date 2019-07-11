import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { capitalizeEachWord } from '../utils';

/**
 * @typedef {Object} Disability
 * @property {String} diagnosticCode
 * @property {String} name
 * @property {String} ratingPercentage
 * @param {Disability} disability
 */
export const disabilityOption = ({ name, ratingPercentage }) => {
  // May need to throw an error to Sentry if any of these doesn't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showRatingPercentage = Number.isInteger(ratingPercentage);

  return (
    <div>
      <h4>{capitalizeEachWord(name)}</h4>
      {showRatingPercentage && (
        <p>
          Current rating: <strong>{ratingPercentage}%</strong>
        </p>
      )}
    </div>
  );
};

export const disabilitiesClarification = (
  <p>
    <strong>Please note:</strong> This list only includes disabilities that
    we’ve already rated. It doesn’t include any disabilities from claims that
    are in progress.
  </p>
);

/**
 * Shows the alert box only if the form has been submitted
 */
export const ratedDisabilitiesAlert = ({ formContext }) => {
  if (!formContext.submitted) return null;
  return (
    <AlertBox
      status="error"
      headline="We need you to add a disability"
      content="You’ll need to add a new disability or choose a rated disability to claim. We can’t process your claim without a disability selected."
    />
  );
};
