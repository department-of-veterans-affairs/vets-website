import React from 'react';
import { convertRatingToStars } from './helpers';

export const renderStars = rating => {
  const starData = convertRatingToStars(rating);

  if (!starData) {
    return null;
  }

  const stars = [];
  for (let i = 0; i < starData.full; i++) {
    stars.push(
      <i
        key={stars.length}
        className="fas fa-star vads-u-color--gold-darker"
      />,
    );
  }

  if (starData.half) {
    stars.push(
      <i
        key={stars.length}
        className="fas fa-star-half-alt vads-u-color--gold-darker"
      />,
    );
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <i
        key={stars.length}
        className="far fa-star vads-u-color--gold-darker"
      />,
    );
  }

  return (
    <div className="rating-stars vads-u-display--inline-block">{stars}</div>
  );
};
