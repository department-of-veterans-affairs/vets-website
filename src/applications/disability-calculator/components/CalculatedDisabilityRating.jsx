import React from 'react';
// import { calculateRating } from '../utils/helpers';

export const CalculatedDisabilityRating = props => {
  // const calculatedRating = props.calculatedRating;
  const displayRating = props.calculatedRating[0];
  const actualRating = props.calculatedRating[1];

  return (
    <div className="vads-u-padding--4">
      <p className="vads-u-font-weight--bold">
        Your VA disability rating
        <br />
        <span className="vads-u-font-weight--bold vads-u-font-size--2xl">
          {displayRating} %
        </span>
      </p>
      <p>
        The actual combined value of your disability ratings is
        <span className="vads-u-font-weight--bold"> {actualRating}%</span>. We
        round this number to the nearest 10% to get your combined rating. We
        round values ending in 1 to 4 down, and those ending in 5 to 9 up. We
        then use this VA disability rating to determine your monthly disability
        compensation payment.
      </p>
      <a href="#">Find your monthly payment amount</a>
    </div>
  );
};
