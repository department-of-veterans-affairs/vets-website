import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { MobileMapResultTypes } from '../../types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationDistance from './common/LocationDistance';
import LocationMarker from './common/LocationMarker';
import LocationPhoneLink from './common/LocationPhoneLink';
import ProviderServiceDescription from '../ProviderServiceDescription';
import ProviderTraining from './common/ProviderTraining';

const CCProviderResult = ({
  headerHasFocus = false,
  headerRef = null,
  provider,
  query,
  setHeaderHasFocus,
}) => {
  const { name } = provider.attributes;

  useEffect(() => {
    if (headerRef?.current && !headerHasFocus) {
      focusElement(headerRef.current);
      setHeaderHasFocus(true);
    }
  }, []);

  return (
    <div className="facility-result" id={provider.id} key={provider.id}>
      <div>
        <LocationMarker markerText={provider.markerText} />
        <ProviderServiceDescription provider={provider} query={query} />
        <h3 className="vads-u-margin-y--0" ref={headerRef}>
          {name}
        </h3>
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
      </div>
    </div>
  );
};

CCProviderResult.propTypes = {
  index: PropTypes.number,
  location: PropTypes.object,
  ...MobileMapResultTypes,
  query: PropTypes.object,
  setHeaderHasFocus: PropTypes.func,
};

export default CCProviderResult;
