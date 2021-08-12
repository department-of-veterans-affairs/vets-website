import React from 'react';
import PropTypes from 'prop-types';

const LocationDistance = ({ distance, markerText }) => {
  if (!distance) return null;

  return (
    <p>
      {markerText && <span className="i-pin-card-map">{markerText}</span>}
      <span className="vads-u-margin-left--1">
        <strong>{distance.toFixed(1)} miles</strong>
      </span>
    </p>
  );
};

LocationDistance.propTypes = {
  distance: PropTypes.number,
  markerText: PropTypes.string,
};

export default LocationDistance;
