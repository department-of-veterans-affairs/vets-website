import React from 'react';
import { connect } from 'react-redux';

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

const mapStateToProps = state => {
  return {
    appointment: state.checkInData.appointment,
  };
};

export default connect(mapStateToProps)(AppointmentLocation);
