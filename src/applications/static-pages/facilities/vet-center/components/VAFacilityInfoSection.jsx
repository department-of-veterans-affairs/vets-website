import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityAddress from './VAFacilityAddress';

function VAFacilityInfoSection(props) {
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
      <VAFacilityAddress vaFacility={props.vaFacility} />
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
