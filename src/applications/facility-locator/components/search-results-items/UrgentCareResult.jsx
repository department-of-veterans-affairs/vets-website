import React from 'react';
import PropTypes from 'prop-types';

import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationMarker from './common/LocationMarker';
import LocationPhoneLink from './common/LocationPhoneLink';
import ProviderTraining from './common/ProviderTraining';

const UrgentCareResult = ({ provider, query }) => {
  const { name } = provider.attributes;

  return (
    <div className="facility-result" id={provider.id} key={provider.id}>
      <div>
        <LocationMarker markerText={provider.markerText} />
        <h3 className="vads-u-margin-y--0">{name}</h3>
        {provider.attributes.orgName && <h6>{provider.attributes.orgName}</h6>}
        <LocationDistance distance={provider.distance} />
        <ProviderTraining provider={provider} />
        <LocationAddress location={provider} />
        <LocationDirectionsLink
          location={provider}
          from="SearchResult"
          query={query}
        />
        <LocationPhoneLink
          location={provider}
          from="SearchResult"
          query={query}
        />
        <p>Call to confirm services and hours</p>
        <va-alert
          class="vads-u-margin-top--3"
          slim
          status="info"
          visible
          full-width="false"
        >
          <a
            href="https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent-Care.asp"
            target="_blank"
            rel="noreferrer"
          >
            Learn about your in-network urgent care benefits (opens in a new
            tab)
          </a>
        </va-alert>
      </div>
    </div>
  );
};
UrgentCareResult.propTypes = {
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default UrgentCareResult;
