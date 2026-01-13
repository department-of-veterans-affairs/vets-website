import PropTypes from 'prop-types';
import React from 'react';
import FacilityPhone from '../../FacilityPhone';

export default function ClinicOrFacilityPhone({
  clinicPhone,
  clinicPhoneExtension,
  facilityPhone,
}) {
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
  // if no clinic or facility phone number, it will default to VA main phone number
  return <FacilityPhone />;
}
ClinicOrFacilityPhone.propTypes = {
  clinicPhone: PropTypes.string,
  clinicPhoneExtension: PropTypes.string,
  facilityPhone: PropTypes.string,
};
