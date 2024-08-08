import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityAddress from './VAFacilityAddress';
import VAFacilityTitle from './VAFacilityTitle';
import VAFacilityPhone from './VAFacilityPhone';

function VAFacilityInfoSection(props) {
  const { vaFacility, mainPhone } = props;
  return (
    <>
      <VAFacilityTitle vaFacility={vaFacility} />
      <VAFacilityAddress vaFacility={vaFacility} />
      <VAFacilityPhone
        phoneTitle="Main number"
        phoneNumber={
          vaFacility.entityBundle === 'vet_center_cap'
            ? mainPhone
            : vaFacility.fieldPhoneNumber
        }
      />
      {/* Won't display if number doesn't exist */}
      <VAFacilityPhone
        phoneTitle="Mental health"
        phoneNumber={vaFacility.fieldPhoneMentalHealth}
      />
    </>
  );
}

VAFacilityInfoSection.propTypes = {
  mainPhone: PropTypes.string,
  vaFacility: PropTypes.object,
};

export default VAFacilityInfoSection;
