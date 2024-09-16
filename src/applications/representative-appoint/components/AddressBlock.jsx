import React from 'react';
import PropTypes from 'prop-types';

import Address from './Address';

export default function AddressBlock({ repName, orgName, address }) {
  return (
    <p className="va-address-block">
      {repName && orgName ? (
        <>
          <strong>{repName}</strong>
          <br />
          {orgName}
          <br />
          <br />
        </>
      ) : (
        <>
          <strong>{orgName}</strong>
          <br />
          <br />
        </>
      )}
      <Address address={address} />
    </p>
  );
}

AddressBlock.propTypes = {
  address: PropTypes.object,
  orgName: PropTypes.string,
  repName: PropTypes.string,
};
