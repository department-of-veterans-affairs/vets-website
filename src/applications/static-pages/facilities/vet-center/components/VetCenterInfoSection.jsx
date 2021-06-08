import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

function VetCenterInfoSection(props) {
  const addressDirections = `${props.vetCenter.fieldAddress.addressLine1}, ${
    props.vetCenter.fieldAddress.locality
  }, ${props.vetCenter.fieldAddress.administrativeArea}, ${
    props.vetCenter.fieldAddress.postalCode
  }`;

  const renderPhone = phoneNumber => {
    if (!phoneNumber) return null;
    return (
      <>
        <h4 className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
          Phone
        </h4>
        <div className="main-phone">
          <strong />
          <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
        </div>
      </>
    );
  };

  return (
    <>
      {props.vetCenter.title && (
        <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
          {props.vetCenter.title}
        </h3>
      )}
      <h4 className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
        {props.vetCenter.entityBundle === 'vet_center_cap'
          ? 'Located at'
          : 'Address'}
      </h4>
      <div className="vads-u-margin-bottom--3">
        <address className="vads-u-margin-bottom--0">
          <div>{props.vetCenter.fieldAddress.organization}</div>
          <div>{props.vetCenter.fieldAddress.addressLine1}</div>
          <div>
            {props.vetCenter.fieldAddress.locality}
            {', '}
            {props.vetCenter.fieldAddress.administrativeArea}{' '}
            {props.vetCenter.fieldAddress.postalCode}
          </div>
        </address>
        <div>
          <a
            onCLick={() => {
              recordEvent({
                event: 'directions-link-click',
                'vet-center-facility-name': props.vetCenter.title,
              });
            }}
            href={`https://www.google.com/maps?saddr=Current+Location&daddr=${addressDirections}`}
            aria-label={`Directions to ${props.vetCenter.title} on Google Maps`}
          >
            Directions on Google Maps
          </a>
        </div>
      </div>
      {props.vetCenter.entityBundle === 'vet_center_cap'
        ? renderPhone(props.mainVetCenterPhone)
        : renderPhone(props.vetCenter.fieldPhoneNumber)}
    </>
  );
}

VetCenterInfoSection.propTypes = {
  vetCenter: PropTypes.object,
  mainVetCenterPhone: PropTypes.string,
};

export default VetCenterInfoSection;
