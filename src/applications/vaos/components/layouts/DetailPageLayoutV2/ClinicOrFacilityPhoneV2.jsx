import PropTypes from 'prop-types';
import React from 'react';
import FacilityPhone from '../../FacilityPhone';

export function ClinicOrFacilityPhone({ facility }) {
  if (facility) {
    const { clinicPhone, clinicPhoneExtension, facilityPhone } = facility;

    if (clinicPhone) {
      return (
        <FacilityPhone
          heading="Clinic phone: "
          contact={clinicPhone}
          extension={clinicPhoneExtension}
        />
      );
    }
    if (facilityPhone) {
      return <FacilityPhone contact={facilityPhone} />;
    }
  }
  // if no clinic or facility phone number, it will default to VA main phone number
  return <FacilityPhone />;
}
ClinicOrFacilityPhone.propTypes = {
  facility: PropTypes.object,
};
