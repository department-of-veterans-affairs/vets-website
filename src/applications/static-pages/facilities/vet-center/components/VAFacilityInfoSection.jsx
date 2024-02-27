import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

function VAFacilityInfoSection(props) {
  const addressDirections = `${props.vaFacility.fieldAddress.addressLine1}, ${
    props.vaFacility.fieldAddress.locality
  }, ${props.vaFacility.fieldAddress.administrativeArea}, ${
    props.vaFacility.fieldAddress.postalCode
  }`;

  const renderPhone = (type, phoneNumber) => {
    if (!phoneNumber) return null;
    return (
      <>
        <div className="main-phone">
          <span>
            <strong>{type}: </strong>
          </span>
          <va-telephone contact={phoneNumber} />
        </div>
      </>
    );
  };

  return (
    <>
      {props.vaFacility.title &&
        props.vaFacility.website && (
          <a href={props.vaFacility.website}>
            <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
              {props.vaFacility.title}
            </h3>
          </a>
        )}
      {props.vaFacility.title &&
        !props.vaFacility.website && (
          <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
            {props.vaFacility.title}
          </h3>
        )}

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
      {props.vaFacility.entityBundle === 'vet_center_cap'
        ? renderPhone('Main number', props.mainPhone)
        : renderPhone('Main number', props.vaFacility.fieldPhoneNumber)}
      {!!props.vaFacility.fieldPhoneMentalHealth &&
        renderPhone('Mental health', props.vaFacility.fieldPhoneMentalHealth)}
    </>
  );
}

VAFacilityInfoSection.propTypes = {
  mainPhone: PropTypes.string,
  vaFacility: PropTypes.object,
};

export default VAFacilityInfoSection;
