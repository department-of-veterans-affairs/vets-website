import React from 'react';

export default function FacilityAddress({ name, address, phone }) {
  return (
    <>
      {!!name && (
        <>
          <strong>{name}</strong>
          <br />
        </>
      )}
      {address.address1}
      <br />
      {address.address2}
      {!!address.address2 && <br />}
      {address.address3}
      {!!address.address3 && <br />}
      {address.city}, {address.state} {address.zip}
      <br />
      {!!phone && (
        <dl className="vads-u-margin-y--0">
          <dt className="vads-u-display--inline">
            <strong>Main phone:</strong>
          </dt>{' '}
          <dd className="vads-u-display--inline">
            <a href={`tel:${phone.replace(/-/g, '')}`}>{phone}</a>
          </dd>
        </dl>
      )}
    </>
  );
}
