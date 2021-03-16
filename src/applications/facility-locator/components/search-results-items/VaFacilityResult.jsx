import React from 'react';
import PropTypes from 'prop-types';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import { isVADomain } from '../../utils/helpers';
import { recordResultClickEvents } from '../../utils/analytics';
import { Link } from 'react-router';
import { LocationType, OperatingStatus, Covid19Vaccine } from '../../constants';
import LocationAddress from './common/LocationAddress';
import LocationOperationStatus from './common/LocationOperationStatus';
import LocationDistance from './common/LocationDistance';
import Covid19Alert from './common/Covid19Alert';

const VaFacilityResult = ({ location, query, index }) => {
  const { name, website, operatingStatus } = location.attributes;
  const isCovid19Search =
    query.facilityType === LocationType.HEALTH &&
    query.serviceType === Covid19Vaccine;
  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <>
        <LocationDistance
          distance={location.distance}
          markerText={location.markerText}
        />
        <span
          onClick={() => {
            recordResultClickEvents(location, index);
          }}
        >
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
        <LocationAddress location={location} />
        <LocationDirectionsLink location={location} from={'SearchResult'} />
        {isCovid19Search && <Covid19Alert />}
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
  index: PropTypes.number,
};

export default VaFacilityResult;
