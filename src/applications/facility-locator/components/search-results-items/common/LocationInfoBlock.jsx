import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LocationType, OperatingStatus } from '../../../constants';
import LocationAddress from './LocationAddress';
import { isVADomain } from '../../../utils/helpers';
import LocationOperationStatus from './LocationOperationStatus';

const LocationInfoBlock = ({ location }) => {
  const { name, website, operatingStatus } = location.attributes;
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const { distance } = location;

  return (
    <div>
      {distance &&
        location.resultItem && (
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
            <>
              <h3 className="vads-u-margin-y--0">
                <va-link href={website} text={name} />
              </h3>
              <p className="vads-u-margin-left--1">
                <strong>{distance.toFixed(1)} miles</strong>
              </p>
            </>
          ) : (
            <>
              <h3 className="vads-u-margin-y--0">
                <Link to={`facility/${location.id}`}>{name}</Link>
              </h3>
              <p className="vads-u-margin-left--1">
                <strong>{distance.toFixed(1)} miles</strong>
              </p>
            </>
          )}
        </>
      )}
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
