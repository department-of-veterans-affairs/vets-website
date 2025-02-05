/* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { focusElement } from 'platform/utilities/ui';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationMarker from './common/LocationMarker';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationPhoneLink from './common/LocationPhoneLink';
import { MobileMapResultTypes } from '../../types';

const VaFacilityResult = ({
  headerHasFocus = false,
  headerRef = null,
  index,
  location,
  query,
  setHeaderHasFocus,
  showHealthConnectNumber,
}) => {
  useEffect(() => {
    if (headerRef?.current && !headerHasFocus) {
      focusElement(headerRef.current);
      setHeaderHasFocus(true);
    }
  }, []);

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
            onClick={clickHandler}
            onKeyDown={clickHandler}
            ref={headerRef}
          >
            <va-link href={website} text={name} />
          </h3>
        ) : (
          <h3
            className="vads-u-margin-y--0"
            onClick={clickHandler}
            onKeyDown={clickHandler}
            ref={headerRef}
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
        <LocationDirectionsLink
          location={location}
          from="SearchResult"
          query={query}
        />
        <LocationPhoneLink
          location={location}
          from="SearchResult"
          query={query}
          showHealthConnectNumber={showHealthConnectNumber}
        />
      </>
    </div>
  );
};

VaFacilityResult.propTypes = {
  index: PropTypes.number,
  location: PropTypes.object,
  ...MobileMapResultTypes,
  query: PropTypes.object,
  showHealthConnectNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default VaFacilityResult;
