import React from 'react';
import PropTypes from 'prop-types';

import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationPhoneLink from './common/LocationPhoneLink';

import recordEvent from 'platform/monitoring/record-event';

/**
 * Urgent care
 * - All urgent care
 * - VA urgent care
 * - Community urgent care providers (in VA's network)
 *
 * Community providers (in VA’s network)
 *  - Clinic/Center - Urgent Care
 */
const UrgentCareResult = ({ provider, query }) => {
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
        <p>Call to confirm services and hours</p>
        <div
          className={`usa-alert usa-alert-info background-color-only vads-u-padding--1  vads-u-font-weight--bold`}
        >
          <i
            aria-hidden="true"
            className={`fa fa-info-circle vads-u-margin-top--1 icon-base`}
          />
          <div className="usa-alert-body">
            <a
              href={
                'https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent_Care.asp'
              }
              target={'_/blank'}
              onClick={() => {
                // Record event
                recordEvent({ event: 'cta-primary-button-click' });
              }}
            >
              In-network urgent care benefit{' '}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
UrgentCareResult.propTypes = {
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default UrgentCareResult;
