export const appointmentIcon = appointment => {
  const isPhone = appointment.isVAPhoneAppointment;
  const {
    isCommunityCare,
    isCompAndPenAppointment,
    isCOVIDVaccine,
    isPendingAppointment,
  } = appointment;

  if (isPhone && !isPendingAppointment) {
    return 'phone';
  }

  if (isCommunityCare) {
    return 'calendar_today';
  }

  if (
    (appointment.isInPersonVisit && !isPendingAppointment) ||
    isCOVIDVaccine ||
    isCompAndPenAppointment ||
    appointment.isClinicVideoAppointment ||
    appointment.isAtlasVideoAppointment
  ) {
    return 'location_city';
  }

  if (appointment.isVideoAtHome) {
    return 'videocam';
  }
  return 'calendar_today';
};
