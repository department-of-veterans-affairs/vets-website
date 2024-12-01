import React from 'react';
import PropTypes from 'prop-types';

const GoogleMapsLink = props => {
  const { addressDirections, title } = props;
  if (!addressDirections) return null;
  return (
    <va-link
      text="Get directions on Google Maps"
      href={`https://www.google.com/maps?saddr=Current+Location&daddr=${addressDirections}`}
      label={`Get directions on Google Maps to ${title}`}
    />
  );
};

GoogleMapsLink.propTypes = {
  addressDirections: PropTypes.string,
  title: PropTypes.string,
};

export default GoogleMapsLink;
