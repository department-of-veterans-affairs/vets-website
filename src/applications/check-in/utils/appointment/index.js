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
export { hasMoreAppointmentsToCheckInto, sortAppointmentsByStartTime };
