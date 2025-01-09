import React from 'react';
import PropTypes from 'prop-types';

function buildAddressArray(location) {
  // Community Care appointment address format
  if (location?.address?.street) {
    const { address } = location;

    if (address && Object.keys(address).length) {
      return [
        address.street,
        address.appt,
        `${address.city}, ${address.state} ${address.zipCode}`,
      ].filter(x => !!x);
    }

    return [];
  }

  // FHIR address format
  if (location?.address) {
    const { address } = location;

    return address.line
      .concat([`${address.city}, ${address.state} ${address.postalCode}`])
      .filter(x => !!x);
  }

  return [];
}

export default function FacilityDirectionsLink({ location, icon }) {
  if (!location) {
    return null;
  }

  let address = buildAddressArray(location);

  if (address.length !== 0) {
    address = address.join(', ');
  } else if (location.position) {
    // If we don't have an address fallback on coords
    const { latitude, longitude } = location.position;
    address = `${latitude},${longitude}`;
  }

  return (
    <span>
      <a
        href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`}
      >
        {icon && <va-icon icon="directions" size="3" />}
        Directions
      </a>
    </span>
  );
}

FacilityDirectionsLink.propTypes = {
  icon: PropTypes.bool,
  location: PropTypes.object,
};
