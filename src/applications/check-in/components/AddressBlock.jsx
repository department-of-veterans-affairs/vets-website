import React from 'react';

const AddressBlock = ({ address }) => {
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
      } ${address.zip}`}</span>
    </>
  );
};

export default AddressBlock;
