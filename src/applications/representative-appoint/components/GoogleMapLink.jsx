import React from 'react';
import PropTypes from 'prop-types';

import Address from './Address';

export default function GoogleMapLink({ address, recordClick }) {
  const addressString =
    [address.addressLine1, address.addressLine2, address.addressLine3]
      .filter(Boolean)
      .join(' ') +
    (address.city ? ` ${address.city},` : '') +
    (address.stateCode ? ` ${address.stateCode}` : '') +
    (address.zipCode ? ` ${address.zipCode}` : '');

  return (
    <>
      <div className="vads-u-display--flex">
        <va-icon icon="location_on" size="3" />
        <a
          href={`https://maps.google.com?daddr=${addressString}`}
          tabIndex="0"
          className="address-anchor vads-u-margin-left--1"
          onClick={recordClick}
          target="_blank"
          rel="noreferrer"
          aria-label={`${address} (opens in a new tab)`}
        >
          <Address address={address} />
        </a>
      </div>
    </>
  );
}

GoogleMapLink.propTypes = {
  address: PropTypes.object.isRequired,
  recordClick: PropTypes.func.isRequired,
};
