import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLink from './GoogleMapsLink';

const getAddressForDirections = fieldAddress => {
  return `${fieldAddress.addressLine1}, ${fieldAddress.locality}, ${
    fieldAddress.administrativeArea
  }, ${fieldAddress.postalCode}`;
};

function VAFacilityAddress(props) {
  const addressDirections = getAddressForDirections(
    props.vaFacility.fieldAddress,
  );
  return (
    <>
      <div className="vads-u-margin-bottom--1">
        <address className="vads-u-margin-bottom--0">
          <div>{props.vaFacility.fieldAddress.organization}</div>
          <div>{props.vaFacility.fieldAddress.addressLine1}</div>
          <div>
            {`${props.vaFacility.fieldAddress.locality}, ${
              props.vaFacility.fieldAddress.administrativeArea
            } ${props.vaFacility.fieldAddress.postalCode}`}
          </div>
        </address>
        <div>
          <GoogleMapsLink
            title={props.vaFacility.title}
            addressDirections={addressDirections}
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
