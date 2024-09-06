import React from 'react';
import PropTypes from 'prop-types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDistance from './common/LocationDistance';

const PharmacyResult = ({ provider, query }) => {
  const { name } = provider.attributes;
  return (
    <div className="facility-result" id={provider.id} key={provider.id}>
      <div>
        <LocationDistance
          distance={provider.distance}
          markerText={provider.markerText}
        />
        <span>
          <h3 className="vads-u-margin-top--0">{name}</h3>
          {provider.attributes.orgName && (
            <h6>{provider.attributes.orgName}</h6>
          )}
        </span>
        <LocationAddress location={provider} />
        <LocationDirectionsLink location={provider} from="SearchResult" />
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
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default PharmacyResult;
