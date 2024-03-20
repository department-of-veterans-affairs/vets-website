import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapsLink from './GoogleMapsLink';

const buildAddressLine = vaFacility => {
  return `${vaFacility.fieldAddress.addressLine1}, ${
    vaFacility.fieldAddress.locality
  }, ${vaFacility.fieldAddress.administrativeArea}, ${
    vaFacility.fieldAddress.postalCode
  }`;
};
function VAFacilityAddress(props) {
  const addressDirections = buildAddressLine(props.vaFacility);
  const { fieldAddress, title } = props.vaFacility;
  return (
    <div className="vads-u-margin-bottom--1">
      <address className="vads-u-margin-bottom--0">
        <div>{fieldAddress.organization}</div>
        <div>{fieldAddress.addressLine1}</div>
        <div>
          {`${fieldAddress.locality}, ${fieldAddress.administrativeArea} ${
            fieldAddress.postalCode
          }`}
        </div>
      </address>
      <div>
        <GoogleMapsLink addressDirections={addressDirections} title={title} />
      </div>
    </div>
  );
}
VAFacilityAddress.propTypes = {
  vaFacility: PropTypes.object,
};
export default VAFacilityAddress;
