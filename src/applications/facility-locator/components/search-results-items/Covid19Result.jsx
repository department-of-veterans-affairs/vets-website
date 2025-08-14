/* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationMarker from './common/LocationMarker';
import CovidPhoneLink from './common/Covid19PhoneLink';

const Covid19Result = ({ index, isMobile = false, location }) => {
  const {
    name,
    website,
    operatingStatus,
    detailedServices,
    phone,
  } = location.attributes;

  const appointmentPhone =
    detailedServices?.[0]?.appointmentPhones?.[0] || null;
  const infoURL = detailedServices?.[0]?.path || null;

  const clickHandler = useCallback(
    event => {
      // Keyboard events fire their onKeyDown event and the onClick event
      // This prevents the duplicate event from logging
      if (event?.key !== 'Enter') {
        recordResultClickEvents(location, index);
      }
    },
    [index, location],
  );

  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <>
        <LocationMarker markerText={location.markerText} />
        {isVADomain(website) ? (
          <h3
            className="vads-u-margin-y--0"
            id={isMobile ? 'fl-provider-name' : undefined}
            onClick={clickHandler}
            onKeyDown={clickHandler}
            tabIndex={0}
          >
            <va-link href={website} text={name} />
          </h3>
        ) : (
          <h3
            className="vads-u-margin-y--0"
            id={isMobile ? 'fl-provider-name' : undefined}
            onClick={clickHandler}
            onKeyDown={clickHandler}
            tabIndex={0}
          >
            <Link to={`facility/${location.id}`}>{name}</Link>
          </h3>
        )}
        <LocationDistance distance={location.distance} />
        {operatingStatus &&
          operatingStatus.code !== OperatingStatus.NORMAL && (
            <LocationOperationStatus operatingStatus={operatingStatus} />
          )}
        <LocationAddress location={location} />
        <LocationDirectionsLink location={location} />
        {appointmentPhone ? (
          <CovidPhoneLink
            phone={appointmentPhone}
            labelId={`${location.id}-phoneLabel`}
          />
        ) : (
          <div>
            <strong id={`${location.id}-phoneLabel`}>
              Main number :&nbsp;
            </strong>
            <va-telephone
              className="vads-u-margin-left--0p25"
              contact={phone.main}
              message-aria-describedby="Main Number"
            />
          </div>
        )}
        {infoURL && (
          <span className="vads-u-margin-top--2 vads-u-display--block">
            <va-link
              href={infoURL}
              target="_blank"
              rel="noreferrer"
              text="COVID-19 info at this location"
            />
          </span>
        )}
      </>
    </div>
  );
};

Covid19Result.propTypes = {
  index: PropTypes.number,
  isMobile: PropTypes.bool,
  location: PropTypes.object,
  setHeaderHasFocus: PropTypes.func,
};

export default Covid19Result;
