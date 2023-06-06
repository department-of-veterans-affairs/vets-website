import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const AddressBlock = ({ address, showDirections = false, placeName }) => {
  const { t } = useTranslation();
  const requiredFields = ['street1', 'city', 'state', 'zip'];
  const isValidAddress = requiredFields.every(
    item =>
      Object.prototype.hasOwnProperty.call(address, item) && address[item],
  );

  if (!isValidAddress) {
    return t('not-available');
  }

  const formatAddressLine = line =>
    line in address && address[line] ? (
      <>
        <span data-testid={`address-line-${line}`}>, {address[line]}</span>
      </>
    ) : (
      ''
    );
  const lineTwo = formatAddressLine('street2');
  const lineThree = formatAddressLine('street3');

  const fullAddress = addressObject => {
    let addressString = addressObject.street1;
    if (addressObject.street2) {
      addressString = `${addressString}, ${addressObject.street2}`;
    }
    if (addressObject.street3) {
      addressString = `${addressString}, ${addressObject.street3}`;
    }
    addressString = `${addressString}, ${addressObject.city}, ${
      addressObject.state
    }, ${addressObject.zip}`;
    return addressString;
  };

  return (
    <div data-testid="address-block">
      <span data-testid="address-line-street1">{address.street1}</span>
      {lineTwo}
      {lineThree}
      <br aria-hidden="true" />
      <span data-testid="address-city-state-and-zip">
        {`${address.city}, ${address.state} ${address.zip.substring(0, 5)}`}
      </span>
      {showDirections &&
        placeName && (
          <div data-testid="directions-link-wrapper">
            <i
              className="fas fa-road vads-u-color--link-default vads-u-margin-right--0p5"
              aria-hidden="true"
            />
            <a
              data-testid="directions-link"
              href={`https://maps.google.com?addr=Current+Location&daddr=${fullAddress(
                address,
              )}`}
              aria-label={t('directions-to-location', { location: placeName })}
              target="_blank"
              rel="noreferrer"
            >
              {t('directions')}
            </a>
          </div>
        )}
    </div>
  );
};
AddressBlock.propTypes = {
  address: PropTypes.object,
  placeName: PropTypes.string,
  showDirections: PropTypes.bool,
};

export default AddressBlock;
