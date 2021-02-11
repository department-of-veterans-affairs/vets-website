import React from 'react';
import State from './State';

export default function ResidentialAddress({ address }) {
  return (
    <>
      <span className="vads-u-display--block vads-u-border-left--5px vads-u-border-color--primary vads-u-padding-y--0p5 vads-u-padding-left--1p5 vads-u-margin-bottom--3">
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
