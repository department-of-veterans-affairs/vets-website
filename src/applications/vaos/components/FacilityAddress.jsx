import React from 'react';
import FacilityDirectionsLink from '../components/FacilityDirectionsLink';
import FacilityPhone from './FacilityPhone';
import State from './State';

export default function FacilityAddress({
  name,
  facility,
  showDirectionsLink,
  isHomepageRefresh,
  clinicFriendlyName,
  isCommunityCare,
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
          {address.city}, <State state={address.state} /> {address.postalCode}
          <br />
        </>
      )}
      {showDirectionsLink && (
        <>
          <FacilityDirectionsLink location={facility} />
          <br />
        </>
      )}
      {isHomepageRefresh &&
        !!phone && (
          <div className="vads-u-margin-top--1p5">
            {!isCommunityCare && (
              <>
                <strong>Clinic: </strong> {clinicFriendlyName}
                <br />
              </>
            )}
            <strong>Main phone: </strong>
            <FacilityPhone contact={phone} />
          </div>
        )}
      {!isHomepageRefresh &&
        !!phone && (
          <dl className="vads-u-margin-y--0">
            <dt className="vads-u-display--inline">
              <strong>Main phone:</strong>
            </dt>{' '}
            <dd className="vads-u-display--inline">
              <br />
              <FacilityPhone contact={phone} />
            </dd>
          </dl>
        )}
    </>
  );
}
