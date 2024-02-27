import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

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
          <a
            onClick={() => {
              recordEvent({
                event: 'directions-link-click',
                'va-facility-name': props.vaFacility.title,
              });
            }}
            href={`https://www.google.com/maps?saddr=Current+Location&daddr=${addressDirections}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions on Google Maps{' '}
            <span className="sr-only">{`to ${props.vaFacility.title}`}</span>
          </a>
        </div>
      </div>
    </>
  );
}
VAFacilityAddress.propTypes = {
  vaFacility: PropTypes.object,
};
export default VAFacilityAddress;
