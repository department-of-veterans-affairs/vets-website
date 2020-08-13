import React from 'react';
import PropTypes from 'prop-types';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import { isVADomain } from '../../utils/helpers';
import { Link } from 'react-router';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationOperationStatus from './common/LocationOperationStatus';

/**
 * VA health
 * VA benefits
 * Vet Centers
 * VA cemeteries
 * VA Urgent care
 */
const VaFacilityResult = ({ location, query }) => {
  const { name, website, operatingStatus } = location.attributes;
  const distance = location.distance;
  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <div>
        {distance &&
          location.resultItem && (
            <p>
              <span className="i-pin-card-map">{location.markerText}</span>
              <span className="vads-u-margin-left--1">
                <strong>{distance.toFixed(1)} miles</strong>
              </span>
            </p>
          )}
        <span>
          {isVADomain(website) ? (
            <a href={website}>
              <h3 className="vads-u-font-size--h5 no-marg-top">{name}</h3>
            </a>
          ) : (
            <h3 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h3>
          )}
        </span>
        <LocationAddress location={location} />
        <LocationDirectionsLink location={location} from={'SearchResult'} />
        <LocationPhoneLink
          location={location}
          from={'SearchResult'}
          query={query}
        />
      </div>
      {operatingStatus &&
        operatingStatus.code !== OperatingStatus.NORMAL && (
          <LocationOperationStatus operatingStatus={operatingStatus} />
        )}
    </div>
  );
};

VaFacilityResult.propTypes = {
  location: PropTypes.object,
  query: PropTypes.object,
};

export default VaFacilityResult;
