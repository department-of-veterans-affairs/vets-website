import React from 'react';
import PropTypes from 'prop-types';

const LocationDistance = ({ distance }) => {
  if (!distance) {
    return null;
  }

  return (
    <p data-testid="fl-results-distance">
      <strong>{distance.toFixed(1)} miles</strong>
    </p>
  );
};

LocationDistance.propTypes = {
  distance: PropTypes.number.isRequired,
};

export default LocationDistance;
