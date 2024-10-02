import React from 'react';
import PropTypes from 'prop-types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationMarker from './common/LocationMarker';
import LocationPhoneLink from './common/LocationPhoneLink';
import ProviderServiceDescription from '../ProviderServiceDescription';
import ProviderTraining from './common/ProviderTraining';

const CCProviderResult = ({ provider, query }) => {
  const { name } = provider.attributes;

  return (
    <div className="facility-result" id={provider.id} key={provider.id}>
      <div>
        <LocationMarker markerText={provider.markerText} />
        <span>
          <ProviderServiceDescription provider={provider} query={query} />
          <h3 className="vads-u-margin-y--0">{name}</h3>
          {provider.attributes.orgName && (
            <h6>{provider.attributes.orgName}</h6>
          )}
        </span>
        <LocationDistance distance={provider.distance} />
        <ProviderTraining provider={provider} />
        <LocationAddress location={provider} />
        <LocationDirectionsLink location={provider} from="SearchResult" />
        <LocationPhoneLink
          location={provider}
          from="SearchResult"
          query={query}
        />
      </div>
    </div>
  );
};

CCProviderResult.propTypes = {
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default CCProviderResult;
