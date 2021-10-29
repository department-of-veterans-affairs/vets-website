import { ELIGIBILITY } from './eligibility';

const hasMoreAppointmentsToCheckInto = (appointments, currentAppointment) => {
  return (
    appointments
      .filter(f => f.appointmentIen !== currentAppointment?.appointmentIen)
      .filter(f => f.eligibility === ELIGIBILITY.ELIGIBLE).length > 0
  );
};

const sortAppointmentsByStartTime = appointments => {
  return appointments
    ? [
        ...appointments.sort((first, second) => {
          const f = new Date(first.startTime);
          const s = new Date(second.startTime);
          return new Date(f) - new Date(s);
        }),
      ]
    : [];
};

const removeTimeZone = payload => {
  // Grabing the appointment payload and stripping out timezone here.
  // Chip should be handling this but currently isn't, this code may be refactored out.
  const updatedPayload = { ...payload };
  // These fields have a potential to include a time stamp.
  const timeFields = [
    'checkInWindowEnd',
    'checkInWindowStart',
    'checkedInTime',
    'startTime',
  ];

  const updatedAppointments = updatedPayload.appointments.map(appointment => {
    const updatedAppointment = { ...appointment };
    // If field exists in object we will replace the TZ part of the string.
    timeFields.forEach(field => {
      if (field in updatedAppointment) {
        updatedAppointment[field] = updatedAppointment[field].replace(
          /(?=\.).*/,
          '',
        );
      }
    });
    return updatedAppointment;
  });

  updatedPayload.appointments = updatedAppointments;

  return updatedPayload;
};
export {
  hasMoreAppointmentsToCheckInto,
  sortAppointmentsByStartTime,
  removeTimeZone,
};
