import React from 'react';
import FacilityDirectionsLink from '../components/FacilityDirectionsLink';

export default function FacilityAddress({
  name,
  facility,
  showDirectionsLink,
}) {
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
      {showDirectionsLink && (
        <>
          <FacilityDirectionsLink location={facility} />
          <br />
        </>
      )}
      {!!phone && (
        <dl className="vads-u-margin-y--0">
          <dt className="vads-u-display--inline">
            <strong>Main phone:</strong>
          </dt>{' '}
          <dd className="vads-u-display--inline">
            <a href={`tel:${phone.replace(/[^0-9]/g, '')}`}>{phone}</a>
          </dd>
        </dl>
      )}
    </>
  );
}
