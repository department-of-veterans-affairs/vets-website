import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LocationType } from '../../constants';
import FacilityTypeDescription from '../FacilityTypeDescription';
import ProviderServiceDescription from '../ProviderServiceDescription';
import { isVADomain } from '../../utils/helpers';

const LocationInfoBlock = ({ location, from, query }) => {
  const { name, website } = location.attributes;
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const distance = location.distance;
  return (
    <dt>
      <span className="i-pin-card">{location.markerText}</span>{' '}
      <dfn>
        {distance &&
          location.resultItem && <strong>{distance.toFixed(1)} miles</strong>}
      </dfn>
      {isProvider ? (
        <dfn>
          <ProviderServiceDescription provider={location} query={query} />
          {query.facilityType === 'cc_pharmacy' ||
          query.serviceType === 'NonVAUrgentCare' ? (
            <p>
              <span>
                <strong>{name}</strong>
              </span>
            </p>
          ) : (
            <h2 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`provider/${location.id}`}>{name}</Link>
            </h2>
          )}
          {location.attributes.orgName && (
            <h6>{location.attributes.orgName}</h6>
          )}
        </dfn>
      ) : (
        <dfn>
          <FacilityTypeDescription
            location={location}
            from={from}
            query={query}
          />
          {isVADomain(website) ? (
            <a href={website}>
              <h2 className="vads-u-font-size--h5 no-marg-top">{name}</h2>
            </a>
          ) : (
            <h2 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h2>
          )}
        </dfn>
      )}
    </dt>
  );
};

LocationInfoBlock.propTypes = {
  location: PropTypes.object,
};
export default LocationInfoBlock;
