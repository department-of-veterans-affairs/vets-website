import React from 'react';
import { calculateRating } from '../utils/helpers';

export const CalculatedDisabilityRating = props => {
  //   console.log('props ratings: ', this.props);
  const ratings = props.ratings;
  const calculatedRating = props.calculatedRating;
  //   console.log(`calculatedRating${props}`);
  return (
    <div className="vads-u-padding--4">
      <p className="vads-u-font-weight--bold">
        Your VA disability rating
        <br />
        <span className="vads-u-font-weight--bold vads-u-font-size--2xl">
          {calculatedRating} %
        </span>
      </p>
      <p>
        The final combined value of your disability ratings is
        <span className="vads-u-font-weight--bold">64%</span>. We round this
        number to the nearest 10% to get your combined rating. We round combined
        values ending in 1 to 4 down, and those ending in 5 to 9 up. We round
        down values ending in 1 to 4, and round up values ending in 5 to 9.
      </p>
      <a href="#">Find your monthly payment amount</a>
    </div>
  );
};
