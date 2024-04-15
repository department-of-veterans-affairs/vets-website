import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

export default function List({ ratings }) {
  return (
    <div className="rating-list">
      {ratings.map((rating, index) => (
        <ListItem rating={rating} key={index} />
      ))}
    </div>
  );
}

List.propTypes = {
  ratings: PropTypes.arrayOf(
    PropTypes.shape({
      decision: PropTypes.string,
      diagnosticText: PropTypes.string,
      diagnosticTypeCode: PropTypes.string,
      diagnosticTypeName: PropTypes.string,
      disabilityRatingId: PropTypes.string,
      effectiveDate: PropTypes.string,
      ratingEndDate: PropTypes.string,
      ratingPercentage: PropTypes.number,
    }),
  ).isRequired,
};
