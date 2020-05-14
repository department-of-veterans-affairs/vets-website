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
      {facility.address.map((line, index) => (
        <>
          {line}
          {index < facility.address.length - 1 ? <br /> : null}
        </>
      ))}
      {address.city}, {address.state} {address.postalCode}
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
