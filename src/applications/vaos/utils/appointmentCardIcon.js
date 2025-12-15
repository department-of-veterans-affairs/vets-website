import {
  isVAPhoneAppointment,
  isClinicVideoAppointment,
  isAtlasVideoAppointment,
  isVideoAtHome,
  isInPersonVisit,
} from '../services/appointment';

export const appointmentIcon = appointment => {
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
