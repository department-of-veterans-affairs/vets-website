import React from 'react';

export default function FacilityAddress({ name, address }) {
  return (
    <>
      <strong>{name}</strong>
      <br />
      {address.address1}
      <br />
      {address.address2}
      {!!address.address2 && <br />}
      {address.address3}
      {!!address.address3 && <br />}
      {address.city}, {address.state} {address.zip}
    </>
  );
}
