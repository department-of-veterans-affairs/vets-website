import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/representativeAddress';

function RepresentativeDirectionsLink({ representative, query }) {
  let address = buildAddressArray(representative);
  const rep = representative.attributes;

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
        <div>
          {rep.addressLine1} {rep.addressLine2}
        </div>
        <div>
          {rep.city}, {rep.stateCode} {rep.zipCode}
        </div>
      </a>
    </div>
  );
}

RepresentativeDirectionsLink.propTypes = {
  location: PropTypes.object,
  representative: PropTypes.shape({
    representative: PropTypes.shape({
      attributes: PropTypes.shape({
        fullName: PropTypes.string,
        name: PropTypes.string,
      }),
    }),
  }),
  query: PropTypes.shape({
    context: PropTypes.shape({ location: PropTypes.string }),
  }),
};

export default RepresentativeDirectionsLink;
