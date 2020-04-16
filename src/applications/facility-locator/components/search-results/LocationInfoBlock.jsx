import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LocationType } from '../../constants';
import LocationAddress from './LocationAddress';
import FacilityTypeDescription from '../FacilityTypeDescription';
import ProviderServiceDescription from '../ProviderServiceDescription';
import { isVADomain } from '../../utils/helpers';

const showOperationStatus = operationStatus => {
  if (!operationStatus) {
    return null;
  }
  let infoMsg;
  let classNameAlert;
  if (operationStatus === 1) {
    infoMsg = 'Facility notice';
    classNameAlert = 'usa-alert-info';
  }
  if (operationStatus === 2) {
    infoMsg = 'Limited services and hours';
    classNameAlert = 'usa-alert-warning';
  }
  if (operationStatus === 3) {
    infoMsg = 'Facility Closed';
    classNameAlert = 'usa-alert-error';
  }
  return (
    <div
      className={`usa-alert ${classNameAlert} background-color-only notice-op-hr`}
    >
      <i
        className={`fa fa-exclamation-${
          operationStatus === 1 || operationStatus === 3 ? 'circle' : 'triangle'
        }`}
      />
      <div className="usa-alert-body">{infoMsg}</div>
    </div>
  );
};

const LocationInfoBlock = ({ location, from, query }) => {
  const { name, website, operationStatus } = location.attributes;
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const distance = location.distance;
  return (
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
      {isProvider ? (
        <span>
          <ProviderServiceDescription provider={location} query={query} />
          {query.facilityType === 'cc_pharmacy' ||
          query.serviceType === 'NonVAUrgentCare' ? (
            <p>
              <span>
                <strong>{name}</strong>
              </span>
            </p>
          ) : (
            <h2 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`provider/${location.id}`}>{name}</Link>
            </h2>
          )}
          {location.attributes.orgName && (
            <h6>{location.attributes.orgName}</h6>
          )}
        </span>
      ) : (
        <span>
          <FacilityTypeDescription
            location={location}
            from={from}
            query={query}
          />
          {isVADomain(website) ? (
            <a href={website}>
              <h2 className="vads-u-font-size--h5 no-marg-top">{name}</h2>
            </a>
          ) : (
            <h2 className="vads-u-font-size--h5 no-marg-top">
              <Link to={`facility/${location.id}`}>{name}</Link>
            </h2>
          )}
        </span>
      )}
      {operationStatus && showOperationStatus(operationStatus)}
      <p>
        <LocationAddress location={location} />
      </p>
    </div>
  );
};

LocationInfoBlock.propTypes = {
  location: PropTypes.object,
};
export default LocationInfoBlock;
