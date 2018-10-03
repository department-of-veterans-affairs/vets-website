import React from 'react';
import { getDisabilityName } from '../utils';

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
      <h4>{getDisabilityName(name)}</h4>
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
    we've already rated. It doesn't include any disabilities from claims that
    are in progress.
  </p>
);
