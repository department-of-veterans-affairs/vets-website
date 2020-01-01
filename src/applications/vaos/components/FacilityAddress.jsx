import React from 'react';
import LocationDirectionsLink from '../components/FacilityDirectionsLink';

export default function FacilityAddress({ name, facility }) {
  const address = facility?.address?.physical;
  const phone = facility?.phone?.main;

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
      <LocationDirectionsLink location={facility} />
      <br />
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
