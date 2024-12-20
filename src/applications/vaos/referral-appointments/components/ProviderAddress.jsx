import React from 'react';
import PropTypes from 'prop-types';
import { getAddressString } from '../utils/provider';

const ProviderAddress = props => {
  const { address, showDirections = false, directionsName, phone } = props;
  return (
    <address data-testid="address-block">
      <p className="vads-u-margin--0">
        {address.street1} <br />
        {address.street2 && (
          <span data-testid="street2">
            {address.street2}
            <br />
          </span>
        )}
        {address.street3 && (
          <span data-testid="street3">
            {address.street3}
            <br />
          </span>
        )}
        {address.city}, {address.state}, {address.zip}
      </p>
      {showDirections &&
        directionsName && (
          <div
            data-testid="directions-link-wrapper"
            className="vads-u-display--flex vads-u-color--link-default"
          >
            <va-icon
              className="vads-u-margin-right--0p5 vads-u-color--link-default"
              icon="directions"
              size={3}
            />
            <a
              data-testid="directions-link"
              href={`https://maps.google.com?addr=Current+Location&daddr=${getAddressString(
                address,
              )}`}
              aria-label={`directions to ${directionsName}`}
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          </div>
        )}
      <p data-testid="phone">
        Phone: <va-telephone contact={phone} data-testid="provider-telephone" />
      </p>
    </address>
  );
};

ProviderAddress.propTypes = {
  address: PropTypes.object.isRequired,
  phone: PropTypes.string.isRequired,
  directionsName: PropTypes.string,
  showDirections: PropTypes.bool,
};

export default ProviderAddress;
