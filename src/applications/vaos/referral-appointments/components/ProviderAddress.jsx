import React from 'react';
import PropTypes from 'prop-types';
import { getAddressString } from '../utils/referrals';

const ProviderAddress = props => {
  const { address, showDirections = false, directionsName, phone } = props;
  // Ensure address is normalized to use street1, street2, street3 consistently
  const normalizeAddress = addr => {
    if (typeof addr !== 'object' || !addr) return addr;

    const { address1, address2, address3, zipCode, ...rest } = addr;

    return {
      ...rest,
      street1: rest.street1 || address1,
      street2: rest.street2 || address2,
      street3: rest.street3 || address3,
      zip: rest.zip || zipCode,
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
            {normalizedAddress.street1} <br />
            {normalizedAddress.street2 && (
              <span data-testid="street2">
                {normalizedAddress.street2}
                <br />
              </span>
            )}
            {normalizedAddress.street3 && (
              <span data-testid="street3">
                {normalizedAddress.street3}
                <br />
              </span>
            )}
            {normalizedAddress.city},{' '}
            {normalizedAddress.state && `${normalizedAddress.state},`}{' '}
            {normalizedAddress.zip}
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
      {phone && (
        <div data-testid="provider-phone">
          <p className="vads-u-margin-bottom--0" data-testid="phone">
            <strong>Main phone:</strong>
          </p>
          <p className="vads-u-margin--0">
            <va-telephone contact={phone} data-testid="provider-telephone" />
          </p>
        </div>
      )}
    </address>
  );
};

ProviderAddress.propTypes = {
  address: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  directionsName: PropTypes.string,
  phone: PropTypes.string,
  showDirections: PropTypes.bool,
};

export default ProviderAddress;
