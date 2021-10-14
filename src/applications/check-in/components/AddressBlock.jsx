import React from 'react';

const AddressBlock = ({ address }) => {
  const lineTwo =
    'address2' in address ? (
      <>
        <span data-testid="address-line-2">, {address.address2}</span>
      </>
    ) : (
      ''
    );
  const lineThree =
    'address3' in address ? (
      <>
        <span data-testid="address-line-3">, {address.address3}</span>
      </>
    ) : (
      ''
    );

  return (
    <>
      <span data-testid="address-line-1">{address.address1}</span>
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
