import React from 'react';
import PropTypes from 'prop-types';
import LocationPhoneLink from './common/LocationPhoneLink';
import LocationDirectionsLink from './common/LocationDirectionsLink';
import FacilityTypeDescription from '../FacilityTypeDescription';
import { isVADomain } from '../../utils/helpers';
import { Link } from 'react-router';
import { OperatingStatus } from '../../constants';
import LocationAddress from './common/LocationAddress';

const showOperationStatus = operatingStatus => {
  let infoMsg;
  let classNameAlert;
  let iconType;
  if (operatingStatus.code === OperatingStatus.NOTICE) {
    infoMsg = 'Facility notice';
    classNameAlert = 'usa-alert-info';
    iconType = 'circle';
  }
  if (operatingStatus.code === OperatingStatus.LIMITED) {
    infoMsg = 'Limited services and hours';
    classNameAlert = 'usa-alert-warning';
    iconType = 'triangle';
  }
  if (operatingStatus.code === OperatingStatus.CLOSED) {
    infoMsg = 'Facility Closed';
    classNameAlert = 'usa-alert-error';
    iconType = 'circle';
  }
  return (
    <div
      className={`usa-alert ${classNameAlert} background-color-only notice-marg-pad`}
    >
      <i
        className={`fa fa-exclamation-${iconType} vads-u-margin-top--1 icon-base`}
      />
      <div className="usa-alert-body">{infoMsg}</div>
    </div>
  );
};

const VaFacilityResult = ({ location, query }) => {
  const { name, website, operatingStatus } = location.attributes;
  const distance = location.distance;
  return (
    <div className="facility-result" id={location.id} key={location.id}>
      <div>
        {distance &&
          location.resultItem && (
            <p>
              <span className="i-pin-card-map">{location.markerText}</span>
              <span className="vads-u-margin-left--1">
                <strong>{distance.toFixed(1)} miles</strong>
              </span>
            </p>
          )}
        <span>
          <FacilityTypeDescription location={location} query={query} />
          {isVADomain(website) ? (
            <a href={website}>
              <h3 className="vads-u-font-size--h5 no-marg-top">{name}</h3>
            </a>
          ) : (
            <h3 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h3>
          )}
        </span>
        {operatingStatus &&
          operatingStatus.code !== OperatingStatus.NORMAL &&
          showOperationStatus(operatingStatus)}
        <p>
          <LocationAddress location={location} />
        </p>
        <LocationDirectionsLink
          location={location}
          from={'SearchResult'}
          query={query}
        />
        <LocationPhoneLink
          location={location}
          from={'SearchResult'}
          query={query}
        />
      </div>
    </div>
  );
};

VaFacilityResult.propTypes = {
  location: PropTypes.object,
  query: PropTypes.object,
};

export default VaFacilityResult;
