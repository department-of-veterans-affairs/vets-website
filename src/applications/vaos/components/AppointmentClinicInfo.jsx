import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function AppointmentClinicInfo({
  show,
  clinicLocationInfo,
  apptId,
  isCanceled = false,
}) {
  // The show prop allows us to conditionally render this component - not leaving empty divs in the DOM
  if (!show) {
    return null;
  }
  return (
    <div
      id={`vaos-appts__clinic-namelocation-${apptId}`}
      data-testid={`vaos-appts__clinic-namelocation-${apptId}`}
    >
      {clinicLocationInfo.name && (
        <div
          id={`vaos-appts__clinic-name-${apptId}`}
          data-testid={`vaos-appts__clinic-name-${apptId}`}
          className={classNames({
            'small-desktop-screen:vads-u-margin-bottom--1': !!clinicLocationInfo.location,
          })}
          style={{ textDecoration: isCanceled ? 'line-through' : 'none' }}
        >
          Clinic: {clinicLocationInfo.name}
        </div>
      )}
      {clinicLocationInfo.location && (
        <div
          id={`vaos-appts__clinic-location-${apptId}`}
          data-testid={`vaos-appts__clinic-location-${apptId}`}
          style={{ textDecoration: isCanceled ? 'line-through' : 'none' }}
        >
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
  isCanceled: PropTypes.bool,
  show: PropTypes.bool,
};

export default AppointmentClinicInfo;
