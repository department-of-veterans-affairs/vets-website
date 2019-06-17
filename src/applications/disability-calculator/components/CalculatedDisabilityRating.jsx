import React from 'react';

export const CalculatedDisabilityRating = props => {
  const displayRating = props.calculatedRating[0];
  const actualRating = props.calculatedRating[1];

  return (
    <div className="vads-u-padding--4">
      <p>
        <strong>Your VA disability rating</strong>
        <br />
        <strong>
          <span className="vads-u-font-size--2xl">{displayRating} %</span>
        </strong>
      </p>
      <p>
        The actual combined value of your disability ratings is
        <strong> {actualRating}%</strong>. We round this number to the nearest
        10% to get your combined rating. We round values ending in 1 to 4 down,
        and those ending in 5 to 9 up. We then use this VA disability rating to
        determine your monthly disability compensation payment.
      </p>
      <a href="#">Find your monthly payment amount</a>
    </div>
  );
};
