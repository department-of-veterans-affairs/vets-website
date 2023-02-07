import React from 'react';
import { convertRatingToStars } from '../../../utils/helpers';

export const RatingsStars = ({ rating }) => {
  const starData = convertRatingToStars(rating);

  if (!starData) {
    return null;
  }

  const stars = [];
  for (let i = 0; i < starData.full; i++) {
    stars.push(
      <i
        key={stars.length}
        className="fas fa-star vads-u-color--gold-darker vads-u-margin-right--0p2"
      />,
    );
  }

  if (starData.half) {
    stars.push(
      <i
        key={stars.length}
        className="fas fa-star-half-alt vads-u-color--gold-darker vads-u-margin-right--0p2"
      />,
    );
  }

  for (let i = stars.length; i < 4; i++) {
    stars.push(
      <i
        key={stars.length}
        className="far fa-star vads-u-color--gold-darker vads-u-margin-right--0p2"
      />,
    );
  }

  return <div className="vads-u-display--inline-block">{stars}</div>;
};

export default RatingsStars;
