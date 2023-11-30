import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

export default function Section({ ratings }) {
  return (
    <>
      {ratings.map((rating, index) => (
        <ListItem ratedDisability={rating} key={index} />
      ))}
    </>
  );
}

Section.propTypes = {
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
