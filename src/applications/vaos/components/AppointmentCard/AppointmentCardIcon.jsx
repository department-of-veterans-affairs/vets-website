import React from 'react';
import PropTypes from 'prop-types';
import {
  isVAPhoneAppointment,
  isClinicVideoAppointment,
  isAtlasVideoAppointment,
  isVideoHome,
  isGfeVideoAppointment,
  isInPersonVAAppointment,
} from '../../services/appointment';

const iconClass = appointment => {
  const isPhone = isVAPhoneAppointment(appointment);
  const {
    isCommunityCare,
    isCompAndPenAppointment,
    isCOVIDVaccine,
  } = appointment.vaos;

  if (isPhone) {
    return 'fa-phone-alt';
  }

  if (isCommunityCare) {
    return 'fa-calendar';
  }

  if (
    isInPersonVAAppointment ||
    isCOVIDVaccine ||
    isCompAndPenAppointment ||
    isClinicVideoAppointment(appointment) ||
    isAtlasVideoAppointment(appointment)
  ) {
    return 'fa-building';
  }

  if (isVideoHome(appointment) || isGfeVideoAppointment(appointment)) {
    return 'fa-video';
  }
  return 'fa-calendar';
};

export default function AppointmentCardIcon({ appointment }) {
  return (
    <div className="vaos-appts__appointment-details--icon">
      <i
        className={`fas ${iconClass(appointment)}`}
        aria-hidden="true"
        data-testid="appointment-icon"
      />
    </div>
  );
}

AppointmentCardIcon.propTypes = {
  appointment: PropTypes.object.isRequired,
};
