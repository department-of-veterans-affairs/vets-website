import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationDistance from './common/LocationDistance';

const VaFacilityResult = ({
  location,
  query,
  index,
  showHealthConnectNumber,
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
        <LocationDistance
          distance={location.distance}
          markerText={location.markerText}
        />
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions */}
        <span onClick={clickHandler} onKeyDown={clickHandler}>
          {isVADomain(website) ? (
            <h3 className="vads-u-margin-top--0">
              <va-link href={website} text={name} />
            </h3>
          ) : (
            <h3 className="vads-u-margin-top--0">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h3>
          )}
        </span>
        {operatingStatus &&
          operatingStatus.code !== OperatingStatus.NORMAL && (
            <LocationOperationStatus operatingStatus={operatingStatus} />
          )}
        <LocationAddress location={location} />
        <LocationDirectionsLink location={location} from="SearchResult" />
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
  query: PropTypes.object,
  showHealthConnectNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default VaFacilityResult;
