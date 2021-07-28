import React from 'react';
import State from '../../../components/State';

export default function ResidentialAddress({ address }) {
  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Facilities based on your home address:
      </h2>
      <span className="vads-u-display--block vads-u-padding-y--0p5 vads-u-margin-bottom--3">
        {address.addressLine1}
        <br />
        {!!address.addressLine2 && (
          <>
            address.addressLine2
            <br />
          </>
        )}
        {!!address.addressLine3 && (
          <>
            address.addressLine3
            <br />
          </>
        )}
        {address.city}, <State state={address.stateCode} /> {address.zipCode}
      </span>
    </>
  );
}
