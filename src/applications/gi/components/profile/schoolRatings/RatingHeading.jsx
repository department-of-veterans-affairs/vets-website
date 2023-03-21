import React from 'react';
import RatingsStars from './RatingsStars';

export const RatingHeading = ({ ratingCount, displayStars, ratingAverage }) => {
  return (
    <div className="vads-l-grid-container main-rating">
      <div className="vads-l-row">
        <div className="vads-l-col--1 vads-u-margin-right--1p5 ratings-star-block">
          <RatingsStars rating={ratingAverage} />
        </div>

        <div className="vads-u-font-weight--bold vads-u-margin-left--neg1p5">
          {`${displayStars} out of 4 overall`}
        </div>

        <div className="vads-l-row">
          <div className="vads-l-col vads-u-font-weight--bold small-screen:vads-u-font-size--base vads-u-font-family--serif small-screen-font">
            {ratingCount} veterans rated this institution
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingHeading;
