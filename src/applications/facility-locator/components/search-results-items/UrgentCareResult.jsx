import React from 'react';
import PropTypes from 'prop-types';

import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationPhoneLink from './common/LocationPhoneLink';

import { ccUrgentCareLabels } from '../../config';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../../constants';

export const urgentCareCall = query => {
  const content = () => (
    <p>
      {' '}
      Before going to a clinic for urgent care, please call the facility to
      confirm that it's open and able to provide the care you need.{' '}
    </p>
  );

  if (
    query.facilityType === LocationType.URGENT_CARE &&
    query.serviceType === 'NonVAUrgentCare'
  ) {
    return content();
  }
  if (
    query.facilityType === LocationType.CC_PROVIDER &&
    query.serviceType === CLINIC_URGENTCARE_SERVICE
  ) {
    return content();
  }

  return null;
};

export const posProviderName = posCodes => {
  if (posCodes && parseInt(posCodes, 10) === 17) {
    return ccUrgentCareLabels.WalkIn;
  } else if (posCodes && parseInt(posCodes, 10) === 20) {
    return ccUrgentCareLabels.UrgentCare;
  }
  return null;
};

/**
 *
 * Urgent care
 * - All urgent care
 * - VA urgent care
 * - Community urgent care providers (in VA's network)
 *
 * Community providers (in VA’s network)
 *  - Clinic/Center - Urgent Care
 */

const UrgentCareResult = ({ provider, query }) => {
  const { name, posCodes } = provider.attributes;
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
            <p>{posProviderName(posCodes)}</p>
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
        {urgentCareCall(query)}
      </div>
    </div>
  );
};
UrgentCareResult.propTypes = {
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default UrgentCareResult;
