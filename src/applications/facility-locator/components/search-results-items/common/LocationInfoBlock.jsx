import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LocationAddress from './LocationAddress';
import LocationDistance from './LocationDistance';
import LocationOperationStatus from './LocationOperationStatus';
import { isVADomain } from '../../../utils/helpers';
import { LocationType, OperatingStatus } from '../../../constants';

const LocationInfoBlock = ({ location }) => {
  const { name, website, operatingStatus } = location.attributes;
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const { distance } = location;

  return (
    <div>
      {location.resultItem && (
        <p className="i-pin-card-map">{location.markerText}</p>
      )}
      {isProvider ? (
        <>
          <h2 className="vads-u-margin-top--0">{name}</h2>
          {location.attributes.orgName && (
            <h6>{location.attributes.orgName}</h6>
          )}
        </>
      ) : (
        <>
          {isVADomain(website) ? (
            <h3 className="vads-u-margin-y--0">
              <va-link href={website} text={name} />
            </h3>
          ) : (
            <h3 className="vads-u-margin-y--0">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h3>
          )}
        </>
      )}
      <LocationDistance distance={distance} />
      {operatingStatus &&
        operatingStatus.code !== OperatingStatus.NORMAL && (
          <LocationOperationStatus operatingStatus={operatingStatus} />
        )}
      <p>
        <LocationAddress location={location} />
      </p>
    </div>
  );
};

LocationInfoBlock.propTypes = {
  location: PropTypes.object,
};
export default LocationInfoBlock;
