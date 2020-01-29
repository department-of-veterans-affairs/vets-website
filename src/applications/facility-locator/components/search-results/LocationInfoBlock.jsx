import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LocationType } from '../../constants';
import LocationAddress from './LocationAddress';
import FacilityTypeDescription from '../FacilityTypeDescription';
import ProviderServiceDescription from '../ProviderServiceDescription';
import { isVADomain } from '../../utils/helpers';

const LocationInfoBlock = ({ location }) => {
  const { name, website } = location.attributes;
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const distance = location.distance;
  return (
    <div>
      {isProvider ? (
        <span>
          <h2 className="vads-u-font-size--h5">
            <Link to={`provider/${location.id}`}>{name}</Link>
          </h2>
          {location.attributes.orgName && (
            <h6>{location.attributes.orgName}</h6>
          )}
          <ProviderServiceDescription provider={location} />
        </span>
      ) : (
        <span>
          {isVADomain(website) ? (
            <a href={website}>
              <h2 className="vads-u-font-size--h5">{name}</h2>
            </a>
          ) : (
            <h2 className="vads-u-font-size--h5">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h2>
          )}
          <FacilityTypeDescription location={location} />
        </span>
      )}
      <p>
        <LocationAddress location={location} />
      </p>
      {distance && (
        <p>
          <strong>Distance:</strong> {distance.toFixed(1)} miles
        </p>
      )}
    </div>
  );
};

LocationInfoBlock.propTypes = {
  location: PropTypes.object,
};
export default LocationInfoBlock;
