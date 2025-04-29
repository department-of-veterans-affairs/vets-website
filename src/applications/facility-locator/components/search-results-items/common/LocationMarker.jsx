import React from 'react';
import PropTypes from 'prop-types';

const LocationMarker = ({ markerText }) => {
  if (!markerText) {
    return null;
  }

  return <p className="i-pin-card-map">{markerText}</p>;
};

LocationMarker.propTypes = {
  markerText: PropTypes.number.isRequired,
};

export default LocationMarker;
