import React from 'react';
import { buildAddressArray } from 'platform/utilities/facilities-and-mapbox';

export default function FacilityAddress({ facility }) {
  let address = buildAddressArray(facility);

  if (address.length !== 0) {
    address = address.join(', ');
  } else {
    // If we don't have an address fallback on coords
    const { lat, long } = facility.attributes;
    address = `${lat},${long}`;
  }

  return (
    <div className="vads-u-margin-bottom--1">
      <address className="vads-u-margin-bottom--0">
        <div>{facility.attributes.address.physical.address1}</div>
        <div>
          {facility.attributes.address.physical.city}
          {', '}
          {facility.attributes.address.physical.state}{' '}
          {facility.attributes.address.physical.zip}
        </div>
      </address>
      <div>
        <a
          href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions on Google Maps{' '}
          <span className="sr-only">{`to ${facility.attributes.name}`}</span>
        </a>
      </div>
    </div>
  );
}
