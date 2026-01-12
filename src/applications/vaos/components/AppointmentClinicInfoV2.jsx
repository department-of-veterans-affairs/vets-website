import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function AppointmentClinicInfo({
  clinicLocationInfo,
  apptId,
  isCanceled = false,
}) {
  if (clinicLocationInfo) {
    return (
      <div
        id={`vaos-appts__clinic-namelocation-${apptId}`}
        data-testid={`vaos-appts__clinic-namelocation-${apptId}`}
      >
        {clinicLocationInfo.clinicName && (
          <div
            id={`vaos-appts__clinic-name-${apptId}`}
            data-testid={`vaos-appts__clinic-name-${apptId}`}
            className={classNames({
              'small-desktop-screen:vads-u-margin-bottom--1': !!clinicLocationInfo.location,
            })}
            style={{ textDecoration: isCanceled ? 'line-through' : 'none' }}
          >
            Clinic: {clinicLocationInfo.clinicName}
          </div>
        )}
        {clinicLocationInfo.clinicPhysicalLocation && (
          <div
            id={`vaos-appts__clinic-location-${apptId}`}
            data-testid={`vaos-appts__clinic-location-${apptId}`}
            style={{ textDecoration: isCanceled ? 'line-through' : 'none' }}
          >
            Location: {clinicLocationInfo.clinicPhysicalLocation}
          </div>
        )}
      </div>
    );
  }

  return null;
}

AppointmentClinicInfo.propTypes = {
  apptId: PropTypes.string.isRequired,
  clinicLocationInfo: PropTypes.object.isRequired,
  isCanceled: PropTypes.bool,
};

export default AppointmentClinicInfo;
