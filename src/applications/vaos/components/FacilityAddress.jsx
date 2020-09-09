import React from 'react';
import FacilityDirectionsLink from '../components/FacilityDirectionsLink';

export default function FacilityAddress({
  name,
  facility,
  showDirectionsLink,
}) {
  const address = facility?.address;
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;

  return (
    <>
      {!!name && (
        <>
          <strong>{name}</strong>
          <br />
        </>
      )}
      {!!address && (
        <>
          {address?.line?.map(line => (
            <React.Fragment key={line}>
              {line}
              <br />
            </React.Fragment>
          ))}
          {address.city}, {address.state} {address.postalCode}
          <br />
        </>
      )}
      {/* {!address && (
        <>
          This appointment is scheduled with a community care provider. Please
          do not report to your local VA facility. If you have questions, please
          contact{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            your facility
          </a>{' '}
          community care staff at your local VA.
          <br />
        </>
      )} */}

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
