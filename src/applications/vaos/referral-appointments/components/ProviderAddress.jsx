import React from 'react';
import PropTypes from 'prop-types';
import { getAddressString } from '../utils/referrals';

const ProviderAddress = props => {
  const { address, showDirections = false, directionsName, phone } = props;
  // check if address is a string or an object
  const isAddressString = typeof address === 'string';
  // if address is an object make it a string for the directions link
  const addressString = isAddressString ? address : getAddressString(address);

  return (
    <address data-testid="address-block">
      <p className="vads-u-margin--0">
        {!isAddressString ? (
          <>
            {address.address1} <br />
            {address.address2 && (
              <span data-testid="Address2">
                {address.address2}
                <br />
              </span>
            )}
            {address.address3 && (
              <span data-testid="Address3">
                {address.address3}
                <br />
              </span>
            )}
            {address.city}, {address.state && `${address.state},`}{' '}
            {address.zipCode}
          </>
        ) : (
          <>{address}</>
        )}
      </p>
      {showDirections && directionsName && (
        <div
          data-testid="directions-link-wrapper"
          className="vads-u-display--flex vads-u-color--link-default vads-u-margin-bottom--1"
        >
          <va-icon
            className="vads-u-margin-right--0p5 vads-u-color--link-default"
            icon="directions"
            size={3}
          />
          <a
            data-testid="directions-link"
            href={`https://maps.google.com?addr=Current+Location&daddr=${addressString}`}
            aria-label={`directions to ${directionsName}`}
            target="_blank"
            rel="noreferrer"
          >
            Directions
          </a>
        </div>
      )}
      <p className="vads-u-margin-bottom--0" data-testid="phone">
        <strong>Main phone:</strong>
      </p>
      <p className="vads-u-margin--0">
        <va-telephone contact={phone} data-testid="provider-telephone" />
      </p>
    </address>
  );
};

ProviderAddress.propTypes = {
  address: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  phone: PropTypes.string.isRequired,
  directionsName: PropTypes.string,
  showDirections: PropTypes.bool,
};

export default ProviderAddress;
