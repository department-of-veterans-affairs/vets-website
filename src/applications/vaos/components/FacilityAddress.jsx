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
  showPhone = true,
  level = '4',
}) {
  const address = facility?.address;
  const phone = facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const extraInfoClasses = classNames({
    'vads-u-margin-top--1p5': !!clinicName || !!phone,
  });
  const Heading = `h${level}`;
  const HeadingSub = `h${parseInt(level, 10) + 1}`;

  return (
    <>
      {!!name && (
        <>
          <Heading className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
            {name}
          </Heading>
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
            <HeadingSub className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
              Clinic:
            </HeadingSub>{' '}
            {clinicName}
          </>
        )}
        {showPhone &&
          !!phone && (
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
