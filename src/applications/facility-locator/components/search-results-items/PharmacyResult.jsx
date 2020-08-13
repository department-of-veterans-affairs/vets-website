import React from 'react';
import PropTypes from 'prop-types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationPhoneLink from './common/LocationPhoneLink';

/**
 * Urgent care pharmacies (in VA’s network)
 */
const PharmacyResult = ({ provider, query }) => {
  const { name } = provider.attributes;
  const distance = provider.distance;
  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <div>
        {distance && (
          <p>
            <span className="i-pin-card-map">{provider.markerText}</span>
            <span className="vads-u-margin-left--1">
              <strong>{distance.toFixed(1)} miles</strong>
            </span>
          </p>
        )}
        <span>
          <h2 className="vads-u-font-size--h5 no-marg-top">{name}</h2>
          {provider.attributes.orgName && (
            <h6>{provider.attributes.orgName}</h6>
          )}
        </span>
        <LocationAddress location={provider} />
        <LocationDirectionsLink location={provider} from={'SearchResult'} />
        <LocationPhoneLink
          location={provider}
          from={'SearchResult'}
          query={query}
        />
      </div>
    </div>
  );
};

PharmacyResult.propTypes = {
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default PharmacyResult;
