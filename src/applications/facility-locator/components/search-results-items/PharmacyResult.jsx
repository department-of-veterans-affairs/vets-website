import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationMarker from './common/LocationMarker';

const PharmacyResult = ({ headerRef = null, provider, query }) => {
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef.current);
      }
    },
    [headerRef],
  );

  const { name } = provider.attributes;

  return (
    <div className="facility-result" id={provider.id} key={provider.id}>
      <div>
        <LocationMarker markerText={provider.markerText} />
        <h3 className="vads-u-margin-y--0" ref={headerRef}>
          {name}
        </h3>
        {provider.attributes.orgName && <h6>{provider.attributes.orgName}</h6>}
        <LocationDistance distance={provider.distance} />
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
      </div>
      <p>Call to confirm services and hours</p>
    </div>
  );
};

PharmacyResult.propTypes = {
  headerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.shape({ current: PropTypes.object }),
  ]),
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default PharmacyResult;
