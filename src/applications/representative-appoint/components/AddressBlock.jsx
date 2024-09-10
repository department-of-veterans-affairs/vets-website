import React from 'react';
import PropTypes from 'prop-types';

export default function AddressBlock({ repName, orgName, address }) {
  return (
    <p className="va-address-block">
      <strong>{repName}</strong>
      <br />
      {orgName && (
        <>
          {orgName}
          <br />
        </>
      )}
      <br />
      {address.address1}
      <br />
      {address.address2 && (
        <>
          {address.address2}
          <br />
        </>
      )}
      {address.city}, {address.state} {address.zip}
      <br />
    </p>
  );
}

AddressBlock.propTypes = {
  address: PropTypes.object,
  orgName: PropTypes.string,
  repName: PropTypes.string,
};
