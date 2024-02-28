import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLink from './GoogleMapsLink';

function VAFacilityAddress(props) {
  const addressDirections = `${props.vaFacility.fieldAddress.addressLine1}, ${
    props.vaFacility.fieldAddress.locality
  }, ${props.vaFacility.fieldAddress.administrativeArea}, ${
    props.vaFacility.fieldAddress.postalCode
  }`;
  return (
    <>
      <div className="vads-u-margin-bottom--1">
        <address className="vads-u-margin-bottom--0">
          <div>{props.vaFacility.fieldAddress.organization}</div>
          <div>{props.vaFacility.fieldAddress.addressLine1}</div>
          <div>
            {props.vaFacility.fieldAddress.locality}
            {', '}
            {props.vaFacility.fieldAddress.administrativeArea}{' '}
            {props.vaFacility.fieldAddress.postalCode}
          </div>
        </address>
        <div>
          <GoogleMapsLink
            addressDirections={addressDirections}
            title={props.vaFacility.title}
          />
        </div>
      </div>
    </>
  );
}
VAFacilityAddress.propTypes = {
  vaFacility: PropTypes.object,
};
export default VAFacilityAddress;
