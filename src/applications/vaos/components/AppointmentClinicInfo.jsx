import React from 'react';
import PropTypes from 'prop-types';

function AppointmentClinicInfo({ show, clinicLocationInfo, apptId }) {
  // The show prop allows us to conditionally render this component - not leaving empty divs in the DOM
  if (!show) {
    return null;
  }
  return (
    <div id={`vaos-appts__clinic-namelocation-${apptId}`}>
      {clinicLocationInfo.name && (
        <div
          id={`vaos-appts__clinic-name-${apptId}`}
          className="small-desktop-screen:vads-u-margin-bottom--1"
        >
          Clinic: {clinicLocationInfo.name}
        </div>
      )}
      {clinicLocationInfo.location && (
        <div id={`vaos-appts__clinic-location-${apptId}`}>
          Location: {clinicLocationInfo.location}
        </div>
      )}
    </div>
  );
}

AppointmentClinicInfo.propTypes = {
  apptId: PropTypes.string.isRequired,
  clinicLocationInfo: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
  show: PropTypes.bool,
};

export default AppointmentClinicInfo;
