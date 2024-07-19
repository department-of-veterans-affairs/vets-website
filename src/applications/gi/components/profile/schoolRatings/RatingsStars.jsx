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
      <span className="vads-u-color--gold-darker vads-u-margin-right--0p2">
        <va-icon key={stars.length} icon="star" size={3} />
      </span>,
    );
  }

  if (starData.half) {
    stars.push(
      <span className="vads-u-color--gold-darker vads-u-margin-right--0p2">
        <va-icon key={stars.length} icon="star_half" size={3} />
      </span>,
    );
  }

  for (let i = stars.length; i < 4; i++) {
    stars.push(
      <span className="vads-u-color--gold-darker vads-u-margin-right--0p2">
        <va-icon key={stars.length} icon="star_outline" size={3} />
      </span>,
    );
  }

  return <div className="vads-u-display--inline-block">{stars}</div>;
};

export default RatingsStars;
