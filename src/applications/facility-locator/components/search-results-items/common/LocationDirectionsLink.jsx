import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from 'platform/utilities/facilities-and-mapbox';

function prepareAddress(location) {
  let address = buildAddressArray(location);

  if (address.length !== 0) {
    address = address.join(', ');
  } else {
    // If we don't have an address fallback on coords
    const { lat, long } = location.attributes;
    address = `${lat},${long}`;
  }

  return address;
}
function LocationDirectionsLink({ location }) {
  return (
    <p>
      <va-link
        href={`https://maps.google.com?saddr=${
          location.searchString
        }&daddr=${prepareAddress(location)}`}
        text="Get directions on Google Maps"
        label={`Get directions on Google Maps to ${location.attributes.name}`}
      />
    </p>
  );
}

LocationDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default LocationDirectionsLink;
