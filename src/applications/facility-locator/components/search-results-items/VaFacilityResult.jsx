import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { LocationType, OperatingStatus, Covid19Vaccine } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationDistance from './common/LocationDistance';
import Covid19Alert from './common/Covid19Alert';

const VaFacilityResult = ({
  location,
  query,
  index,
  showHealthConnectNumber,
}) => {
  const { name, website, operatingStatus } = location.attributes;
  const isCovid19Search =
    query.facilityType === LocationType.HEALTH &&
    query.serviceType === Covid19Vaccine;
  const clickHandler = useCallback(
    () => {
      recordResultClickEvents(location, index);
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
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
        <span onClick={clickHandler} onKeyUp={clickHandler} role="link">
          {isVADomain(website) ? (
            <h3 className="vads-u-font-size--h5 no-marg-top">
              <a href={website}>{name}</a>
            </h3>
          ) : (
            <h3 className="vads-u-font-size--h5 no-marg-top">
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
        {isCovid19Search && <Covid19Alert />}
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
