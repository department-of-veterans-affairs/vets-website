import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/representativeAddress';

function RepresentativeDirectionsLink({ representative, from }) {
  let address = buildAddressArray(representative);

  if (address.length !== 0) {
    address = address.join(', ');
  }
  // else {
  //   // If we don't have an address fallback on coords
  //   const { lat, long } = representative.attributes;
  //   address = `${lat},${long}`;
  // }

  return (
    <div className="vads-u-margin-bottom--1p5">
      <a
        href={`https://maps.google.com?saddr=${
          representative.locationInputString
        }&daddr=${address}`}
        rel="noopener noreferrer"
      >
        {from === 'SearchResults' && <i className="fa fa-road" />}
        Get directions on Google Maps{' '}
        <span className="sr-only">
          {`to ${representative.attributes.name}`}
        </span>
      </a>
    </div>
  );
}

RepresentativeDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default RepresentativeDirectionsLink;
