import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const AddressBlock = ({ address }) => {
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

  return (
    <>
      <span data-testid="address-line-street1">{address.street1}</span>
      {lineTwo}
      {lineThree}
      <br />
      <span data-testid="address-city-state-and-zip">
        {`${address.city}, ${address.state} ${address.zip.substring(0, 5)}`}
      </span>
    </>
  );
};
AddressBlock.propTypes = {
  address: PropTypes.object,
};

export default AddressBlock;
