import React from 'react';
import PropTypes from 'prop-types';

import Address from './Address';

export default function GoogleMapLink({ address, recordClick }) {
  const addressString =
    [address.address1, address.address2, address.address3]
      .filter(Boolean)
      .join(' ') +
    (address.city ? ` ${address.city},` : '') +
    (address.state ? ` ${address.state}` : '') +
    (address.zip ? ` ${address.zip}` : '');

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
