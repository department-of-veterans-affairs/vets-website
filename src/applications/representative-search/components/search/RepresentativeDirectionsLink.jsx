import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/representativeAddress';

function RepresentativeDirectionsLink({ representative, query }) {
  let address = buildAddressArray(representative);

  if (address.length !== 0) {
    address = address.join(', ');
  }

  return (
    <div className="vads-u-margin-bottom--1p5 representative-directions-link">
      <a
        href={`https://maps.google.com?saddr=${
          query?.context?.location
        }&daddr=${address}`}
        rel="noopener noreferrer"
      >
        Get directions on Google Maps{' '}
        <span className="sr-only">
          {`to ${representative?.attributes?.fullName ||
            representative?.attributes?.name}`}
        </span>
      </a>
    </div>
  );
}

RepresentativeDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default RepresentativeDirectionsLink;
