import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../../utils/facilityAddress';

function LocationDirectionsLink({ location, from }) {
  let address = buildAddressArray(location);

  if (address.length !== 0) {
    address = address.join(', ');
  } else {
    // If we don't have an address fallback on coords
    const { lat, long } = location.attributes;
    address = `${lat},${long}`;
  }

  return (
    <div className="vads-u-margin-bottom--1p5">
      {from === 'FacilityDetail' && <va-icon icon="directions" size="3" />}
      <va-link
        href={`https://maps.google.com?saddr=${
          location.searchString
        }&daddr=${address}`}
        text="Get directions on Google Maps"
        label={`Get directions on Google Maps to ${location.attributes.name}`}
      />
    </div>
  );
}

LocationDirectionsLink.propTypes = {
  from: PropTypes.string,
  location: PropTypes.object,
};

export default LocationDirectionsLink;
