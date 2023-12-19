import React from 'react';
import PropTypes from 'prop-types';

const MapLink = props => {
  const { name, address, city, state, postalCode } = props;
  const locationInputString = `${name} ${
    address ? `${address} ` : ''
  }${city}, ${state} ${postalCode}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${locationInputString}`,
  )}`;

  return (
    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
      Get directions on Google Maps
    </a>
  );
};

MapLink.propTypes = {
  city: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  address: PropTypes.string,
};

export default MapLink;
