import React from 'react';
import PropTypes from 'prop-types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationMarker from './common/LocationMarker';

const PharmacyResult = ({ isMobile = false, provider, query }) => {
  const { name } = provider.attributes;

  return (
    <div className="facility-result" id={provider.id} key={provider.id}>
      <div>
        <LocationMarker markerText={provider.markerText} />
        <h3
          className="vads-u-margin-y--0"
          id={isMobile ? 'fl-provider-name' : undefined}
        >
          {name}
        </h3>
        {provider.attributes.orgName && <h6>{provider.attributes.orgName}</h6>}
        <LocationDistance distance={provider.distance} />
        <LocationAddress location={provider} />
        <LocationDirectionsLink location={provider} query={query} />
        <LocationPhoneLink
          location={provider}
          from="SearchResult"
          query={query}
        />
      </div>
      <p>Call to confirm services and hours</p>
    </div>
  );
};

PharmacyResult.propTypes = {
  isMobile: PropTypes.bool,
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default PharmacyResult;
