import React from 'react';
import PropTypes from 'prop-types';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import { isVADomain } from '../../utils/helpers';
import { Link } from 'react-router';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationDistance from './common/LocationDistance';

const VaFacilityResult = ({ location, query }) => {
  const { name, website, operatingStatus } = location.attributes;
  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <>
        <LocationDistance
          distance={location.distance}
          markerText={location.markerText}
        />
        <span>
          {isVADomain(website) ? (
            <h3 id="facility-name" className="vads-u-font-size--h5 no-marg-top">
              <a href={website}>{name}</a>
            </h3>
          ) : (
            <h3 id="facility-name" className="vads-u-font-size--h5 no-marg-top">
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
      </>
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
