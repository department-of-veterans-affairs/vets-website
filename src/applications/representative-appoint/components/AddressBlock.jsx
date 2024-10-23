import React from 'react';
import PropTypes from 'prop-types';

import Address from './Address';

export default function AddressBlock({ repName, orgName, addressData }) {
  return (
    <p className="va-address-block vads-u-margin-left--0 vads-u-margin-bottom--3">
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
          <strong>{repName || orgName}</strong>
          <br />
          <br />
        </>
      )}
      <Address addressData={addressData} />
    </p>
  );
}

AddressBlock.propTypes = {
  addressData: PropTypes.object,
  orgName: PropTypes.string,
  repName: PropTypes.string,
};
