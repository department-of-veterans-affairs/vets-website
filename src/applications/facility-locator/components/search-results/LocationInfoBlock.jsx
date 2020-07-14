import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  CLINIC_URGENTCARE_SERVICE,
  LocationType,
  OperatingStatus,
} from '../../constants';
import LocationAddress from './LocationAddress';
import FacilityTypeDescription from '../FacilityTypeDescription';
import ProviderServiceDescription from '../ProviderServiceDescription';
import { isVADomain } from '../../utils/helpers';

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

const LocationInfoBlock = ({ location, from, query }) => {
  const { name, website, operatingStatus } = location.attributes;
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
          query.serviceType === 'NonVAUrgentCare' ||
          query.serviceType === CLINIC_URGENTCARE_SERVICE ? (
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
      {operatingStatus &&
        operatingStatus.code !== OperatingStatus.NORMAL &&
        showOperationStatus(operatingStatus)}
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
