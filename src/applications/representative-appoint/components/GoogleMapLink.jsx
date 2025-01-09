import React from 'react';
import PropTypes from 'prop-types';

import Address from './Address';
import { getEntityAddressAsString } from '../utilities/helpers';

export default function GoogleMapLink({ addressData, recordClick }) {
  const addressAsString = getEntityAddressAsString(addressData);

  return (
    <>
      <div className="vads-u-display--flex">
        <va-icon icon="location_on" size="3" />
        <a
          href={`https://maps.google.com?daddr=${addressAsString}`}
          tabIndex="0"
          className="address-anchor vads-u-margin-left--1"
          onClick={recordClick}
          target="_blank"
          rel="noreferrer"
          aria-label={`${addressAsString} (opens in a new tab)`}
        >
          <Address addressData={addressData} />
        </a>
      </div>
    </>
  );
}

GoogleMapLink.propTypes = {
  addressData: PropTypes.object.isRequired,
  recordClick: PropTypes.func.isRequired,
};
