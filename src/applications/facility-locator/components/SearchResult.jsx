import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { focusElement } from 'platform/utilities/ui';
import LocationAddress from './search-results-items/common/LocationAddress';
import LocationDistance from './search-results-items/common/LocationDistance';
import LocationOperationStatus from './search-results-items/common/LocationOperationStatus';
import LocationPhoneLink from './search-results-items/common/LocationPhoneLink';
import LocationDirectionsLink from './search-results-items/common/LocationDirectionsLink';
import {
  CLINIC_URGENTCARE_SERVICE,
  LocationType,
  OperatingStatus,
} from '../constants';
import { isVADomain } from '../utils/helpers';
import { isHealthAndHealthConnect } from '../utils/phoneNumbers';

export const urgentCareCall = query => {
  const content = () => (
    <p>
      {' '}
      Before going to a clinic for urgent care, please call the facility to
      confirm that it’s open and able to provide the care you need.{' '}
    </p>
  );
  if (
    query.facilityType === LocationType.URGENT_CARE &&
    query.serviceType === 'NonVAUrgentCare'
  ) {
    return content();
  }
  if (
    query.facilityType === LocationType.CC_PROVIDER &&
    query.serviceType === CLINIC_URGENTCARE_SERVICE
  ) {
    return content();
  }
  return null;
};

const SearchResult = ({ result, query }) => {
  const location = result.attributes;
  const {
    distance,
    markerText,
    name,
    operatingStatus,
    orgName,
    website,
  } = location;

  const isProvider = location.type === LocationType.CC_PROVIDER;
  const headerRef = useRef(null);

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef.current);
      }
    },
    [headerRef],
  );

  return (
    <div className="facility-result" id={result.id}>
      <p className="vads-u-margin-bottom--1 i-pin-card-map">{markerText}</p>
      {isProvider ? (
        <>
          <h2 className="vads-u-margin-top--0" ref={headerRef}>
            {name}
          </h2>
          {orgName && <h6>{orgName}</h6>}
        </>
      ) : (
        <>
          {isVADomain(website) ? (
            <h3 className="vads-u-margin-y--0" ref={headerRef}>
              <va-link href={website} text={name} />
            </h3>
          ) : (
            <h3 className="vads-u-margin-y--0" ref={headerRef}>
              <Link to={`facility/${result.id}`}>{name}</Link>
            </h3>
          )}
        </>
      )}
      <LocationDistance distance={distance} />
      {operatingStatus &&
        operatingStatus.code !== OperatingStatus.NORMAL && (
          <LocationOperationStatus operatingStatus={operatingStatus} />
        )}
      <LocationAddress location={result} />
      <LocationDirectionsLink
        location={result}
        from="SearchResult"
        query={query}
      />
      <LocationPhoneLink
        from="SearchResult"
        location={result}
        query={query}
        showHealthConnectNumber={isHealthAndHealthConnect(result, query)}
      />
      {urgentCareCall(query)}
    </div>
  );
};

SearchResult.propTypes = {
  query: PropTypes.object,
  result: PropTypes.object,
};

export default SearchResult;
