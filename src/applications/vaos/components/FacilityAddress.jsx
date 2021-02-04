import React from 'react';
import classNames from 'classnames';
import FacilityDirectionsLink from '../components/FacilityDirectionsLink';
import FacilityPhone from './FacilityPhone';
import State from './State';

export default function FacilityAddress({
  name,
  facility,
  showDirectionsLink,
  clinicName,
  level = '5',
}) {
  const address = facility?.address;
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const extraInfoClasses = classNames({
    'vads-u-margin-top--1p5': !!clinicName || !!phone,
  });
  const Heading = `h${level}`;

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
      <div className={extraInfoClasses}>
        {!!clinicName && (
          <>
            <Heading className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
              Clinic:
            </Heading>{' '}
            {clinicName}
          </>
        )}
        {!!phone && (
          <>
            {!!clinicName && <br />}
            <Heading className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
              Main phone:
            </Heading>{' '}
            <FacilityPhone contact={phone} />
          </>
        )}
      </div>
    </>
  );
}
