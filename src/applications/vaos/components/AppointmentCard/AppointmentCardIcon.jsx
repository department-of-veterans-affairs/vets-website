import React from 'react';
import PropTypes from 'prop-types';
import {
  isVAPhoneAppointment,
  isClinicVideoAppointment,
  isAtlasVideoAppointment,
  isVideoAtHome,
  isInPersonVisit,
} from '../../services/appointment';

const appointmentIcon = appointment => {
  const isPhone = isVAPhoneAppointment(appointment);
  const {
    isCommunityCare,
    isCompAndPenAppointment,
    isCOVIDVaccine,
    isPendingAppointment,
  } = appointment.vaos;

  if (isPhone && !isPendingAppointment) {
    return 'phone';
  }

  if (isCommunityCare) {
    return 'calendar_today';
  }

  if (
    (isInPersonVisit(appointment) && !isPendingAppointment) ||
    isCOVIDVaccine ||
    isCompAndPenAppointment ||
    isClinicVideoAppointment(appointment) ||
    isAtlasVideoAppointment(appointment)
  ) {
    return 'location_city';
  }

  if (isVideoAtHome(appointment)) {
    return 'videocam';
  }
  return 'calendar_today';
};

export default function AppointmentCardIcon({ appointment }) {
  return (
    <div className="vaos-appts__appointment-details--icon">
      <va-icon
        icon={appointmentIcon(appointment)}
        aria-hidden="true"
        data-testid="appointment-icon"
        size={3}
      />
    </div>
  );
}

AppointmentCardIcon.propTypes = {
  appointment: PropTypes.object.isRequired,
};
