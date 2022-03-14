import React from 'react';
import PropTypes from 'prop-types';

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

AppointmentLocation.propTypes = {
  appointment: PropTypes.object,
  bold: PropTypes.bool,
};

export default AppointmentLocation;
