/* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationMarker from './common/LocationMarker';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationPhoneLink from './common/LocationPhoneLink';

const VaFacilityResult = ({
  index,
  isMobile = false,
  location,
  query,
  showHealthConnectNumber,
  isCemetery = false,
}) => {
  const { name, website, operatingStatus } = location.attributes;

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
            aria-label={name}
          >
            <va-link href={website} text={name} />
          </h3>
        ) : (
          <h3
            className="vads-u-margin-y--0"
            id={isMobile ? 'fl-provider-name' : undefined}
            onClick={clickHandler}
            onKeyDown={clickHandler}
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
        <LocationPhoneLink
          location={location}
          from="SearchResult"
          query={query}
          showHealthConnectNumber={showHealthConnectNumber}
        />
        {isCemetery && (
          <Link to={`facility/${location.id}`}>
            Learn more about burial status
          </Link>
        )}
      </>
    </div>
  );
};

VaFacilityResult.propTypes = {
  index: PropTypes.number,
  isCemetery: PropTypes.bool,
  isMobile: PropTypes.bool,
  location: PropTypes.object,
  query: PropTypes.object,
  showHealthConnectNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default VaFacilityResult;
