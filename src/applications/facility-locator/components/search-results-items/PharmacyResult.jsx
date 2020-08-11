import React from 'react';
import PropTypes from 'prop-types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationPhoneLink from './common/LocationPhoneLink';
import { facilityTypes } from '../../config';

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
          <div>
            <p>{facilityTypes.cc_pharmacy.toUpperCase()}</p>
          </div>
          <h2 className="vads-u-font-size--h5 no-marg-top">{name}</h2>
          {provider.attributes.orgName && (
            <h6>{provider.attributes.orgName}</h6>
          )}
        </span>
        <p>
          <LocationAddress location={provider} />
        </p>
        <LocationDirectionsLink
          location={provider}
          from={'SearchResult'}
          query={query}
        />
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
