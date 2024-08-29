import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FacilityDirectionsLink from './FacilityDirectionsLink';
import FacilityPhone from './FacilityPhone';
import State from './State';
import { hasValidCovidPhoneNumber } from '../services/appointment';

export default function FacilityAddress({
  name,
  facility,
  showDirectionsLink,
  clinicName,
  clinicPhysicalLocation,
  clinicPhone,
  clinicPhoneExtension,
  showPhone = true,
  level = 4,
  showCovidPhone,
  isPhone,
  phoneHeading,
}) {
  const address = facility?.address;
  const phone =
    showCovidPhone && hasValidCovidPhoneNumber(facility)
      ? facility?.telecom?.find(tele => tele.system === 'covid')?.value
      : facility?.telecom?.find(tele => tele.system === 'phone')?.value;
  const extraInfoClasses = classNames({
    'vads-u-margin-top--1p5': !!clinicName || (showPhone && !!phone),
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
          {/* removes falsy values from address array */}
          {address?.line.filter(Boolean).join(', ')}
          <br />
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
      <div className={extraInfoClasses} data-dd-privacy="mask">
        {!!clinicName && (
          <>
            <HeadingSub className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
              Clinic:
            </HeadingSub>{' '}
            {clinicName} <br />
          </>
        )}
        {!!clinicPhysicalLocation &&
          !isPhone && (
            <>
              <HeadingSub className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
                Location:
              </HeadingSub>{' '}
              {clinicPhysicalLocation} <br />
            </>
          )}
        {showPhone &&
          !!clinicPhone && (
            <FacilityPhone
              contact={clinicPhone}
              extension={clinicPhoneExtension}
              heading="Clinic phone:"
              level={level + 1}
            />
          )}
        {showPhone &&
          !!phone &&
          !clinicPhone && (
            <FacilityPhone
              contact={phone}
              level={level + 1}
              heading={phoneHeading}
            />
          )}
      </div>
    </>
  );
}

FacilityAddress.propTypes = {
  facility: PropTypes.object.isRequired,
  clinicName: PropTypes.string,
  clinicPhone: PropTypes.string,
  clinicPhoneExtension: PropTypes.string,
  clinicPhysicalLocation: PropTypes.string,
  isPhone: PropTypes.bool,
  level: PropTypes.number,
  name: PropTypes.string,
  phoneHeading: PropTypes.string,
  showCovidPhone: PropTypes.bool,
  showDirectionsLink: PropTypes.bool,
  showPhone: PropTypes.bool,
};
