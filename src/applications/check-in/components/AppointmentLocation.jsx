import React from 'react';

const AppointmentLocation = ({ appointment }) => {
  let display;

  if (appointment.clinicFriendlyName) {
    display = appointment.clinicFriendlyName;
  } else if (appointment.clinicName) {
    display = appointment.clinicName;
  } else {
    display = appointment.facility;
  }

  return <>{display}</>;
};

export default AppointmentLocation;
