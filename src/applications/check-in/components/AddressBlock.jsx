import React from 'react';
import PropTypes from 'prop-types';

const AddressBlock = ({ address }) => {
  const requiredFields = ['street1', 'city', 'state', 'zip'];
  const isValidAddress = requiredFields.every(
    item =>
      Object.prototype.hasOwnProperty.call(address, item) && address[item],
  );

  if (isValidAddress) {
    const lineTwo =
      'street2' in address && address.street2 ? (
        <>
          <span data-testid="address-line-2">, {address.street2}</span>
        </>
      ) : (
        ''
      );
    const lineThree =
      'street3' in address && address.street2 ? (
        <>
          <span data-testid="address-line-3">, {address.street3}</span>
        </>
      ) : (
        ''
      );

    return (
      <>
        <span data-testid="address-line-1">{address.street1}</span>
        {lineTwo}
        {lineThree}
        <br />
        <span data-testid="address-city-state-and-zip">{`${address.city}, ${
          address.state
        } ${address.zip.substring(0, 5)}`}</span>
      </>
    );
  } else {
    return 'Not Available';
  }
};
AddressBlock.propTypes = {
  address: PropTypes.object,
};

export default AddressBlock;
