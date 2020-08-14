import React from 'react';
import PropTypes from 'prop-types';
import LocationAddress from './common/LocationAddress';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import LocationPhoneLink from './common/LocationPhoneLink';
import recordEvent from 'platform/monitoring/record-event';

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
  );
};

PharmacyResult.propTypes = {
  provider: PropTypes.object,
  query: PropTypes.object,
};

export default PharmacyResult;
