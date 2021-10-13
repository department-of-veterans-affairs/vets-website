import React from 'react';

const AppointmentLocation = ({ appointment, bold }) => {
  let display;

  if (appointment.clinicFriendlyName) {
    display = appointment.clinicFriendlyName;
  } else {
    display = appointment.clinicName;
  }
  if (bold) {
    return <span className="vads-u-font-weight--bold">{display}</span>;
  }
  return <>{display}</>;
};

export default AppointmentLocation;
