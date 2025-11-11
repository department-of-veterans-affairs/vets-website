import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from 'platform/utilities/facilities-and-mapbox';

function LocationDirectionsLink({ location }) {
  let address = buildAddressArray(location);

  if (address.length !== 0) {
    address = address.join(', ');
  } else {
    // If we don't have an address fallback on coords
    const { lat, long } = location.attributes;
    address = `${lat},${long}`;
  }

  return (
    <p>
      <va-link
        href={`https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
          address,
        )}`}
        text="Get directions on Google Maps"
        label={`Get directions on Google Maps to ${location.attributes.name}`}
      />
    </p>
  );
}

LocationDirectionsLink.propTypes = {
  location: PropTypes.object,
  query: PropTypes.object,
};

export default LocationDirectionsLink;
