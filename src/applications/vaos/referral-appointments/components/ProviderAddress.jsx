import React from 'react';
import PropTypes from 'prop-types';
import { getAddressString } from '../utils/referrals';

const ProviderAddress = props => {
  const { address, showDirections = false, directionsName, phone } = props;
  // Ensure address is normalized to use street1, street2, street3 consistently
  const normalizeAddress = addr => {
    if (typeof addr !== 'object' || !addr) return addr;

    const { street1, street2, street3, zipCode, ...rest } = addr;

    return {
      ...rest,
      address1: rest.address1 || street1,
      address2: rest.address2 || street2,
      address3: rest.address3 || street3,
      zipCode: rest.zipCode || zipCode,
    };
  };

  const normalizedAddress = normalizeAddress(address);
  // check if address is a string or an object
  const isAddressString = typeof normalizedAddress === 'string';
  // if address is an object make it a string for the directions link
  const addressString = isAddressString
    ? normalizedAddress
    : getAddressString(normalizedAddress);

  return (
    <address data-testid="address-block">
      <p className="vads-u-margin--0">
        {!isAddressString ? (
          <>
            {normalizedAddress.address1} <br />
            {normalizedAddress.address2 && (
              <span data-testid="Address2">
                {normalizedAddress.address2}
                <br />
              </span>
            )}
            {normalizedAddress.address3 && (
              <span data-testid="Address3">
                {normalizedAddress.address3 || normalizedAddress.street3}
                <br />
              </span>
            )}
            {normalizedAddress.city},{' '}
            {normalizedAddress.state && `${normalizedAddress.state},`}{' '}
            {normalizedAddress.zipCode}
          </>
        ) : (
          <>{normalizedAddress}</>
        )}
      </p>
      {showDirections &&
        directionsName && (
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
