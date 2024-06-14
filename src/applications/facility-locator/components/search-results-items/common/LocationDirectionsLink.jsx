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
      <a
        href={`https://maps.google.com?saddr=${
          location.searchString
        }&daddr=${address}`}
        rel="noopener noreferrer"
      >
        {from === 'FacilityDetail' && <va-icon icon="directions" size="3" />}
        Get directions on Google Maps{' '}
        <span className="sr-only">{`to ${location.attributes.name}`}</span>
      </a>
    </div>
  );
}

LocationDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default LocationDirectionsLink;
