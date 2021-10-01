import React from 'react';

const AppointmentLocation = ({ appointment, bold }) => {
  let display;

  if (appointment.clinicFriendlyName) {
    display = appointment.clinicFriendlyName;
  } else if (appointment.clinicName) {
    display = appointment.clinicName;
  } else {
    display = appointment.facility;
  }
  if (bold) {
    return <span className="vads-u-font-weight--bold">{display}</span>;
  }
  return <>{display}</>;
};

export default AppointmentLocation;
