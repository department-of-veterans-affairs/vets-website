import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityAddress from './VAFacilityAddress';
import VAFacilityTitle from './VAFacilityTitle';
import VAFacilityPhone from './VAFacilityPhone';

function VAFacilityInfoSection(props) {
  return (
    <>
      <VAFacilityTitle vaFacility={props.vaFacility} />
      <VAFacilityAddress vaFacility={props.vaFacility} />
      <VAFacilityPhone
        phoneTitle="Main number"
        phoneNumber={
          props.vaFacility.entityBundle === 'vet_center_cap'
            ? props.mainPhone
            : props.vaFacility.fieldPhoneNumber
        }
      />
      {/* Won't display if number doesn't exist */}
      <VAFacilityPhone
        phoneTitle="Mental health"
        phoneNumber={props.vaFacility.fieldPhoneMentalHealth}
      />
    </>
  );
}

VAFacilityInfoSection.propTypes = {
  mainPhone: PropTypes.string,
  vaFacility: PropTypes.object,
};

export default VAFacilityInfoSection;
