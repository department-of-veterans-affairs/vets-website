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
        <strong>Note:</strong> The actual combined value of your disability
        ratings is {actualRating}
        %.
      </p>
      <p>
        We round this value to the nearest 10% to get your VA disability rating.
        If your value includes a decimal, please note that we don't include
        this. We base our rounding on the whole number only. We round whole
        numbers ending in 1 to 4 down, and those ending in 5 to 9 up. We then
        use this VA disability rating to determine your monthly disability
        compensation payment.
      </p>
      <a href="#">Find your monthly payment amount</a>
    </div>
  );
};
