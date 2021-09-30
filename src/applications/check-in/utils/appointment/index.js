import { STATUSES } from './status';

const hasMoreAppointmentsToCheckInto = (appointments, currentAppointment) => {
  return (
    appointments
      .filter(f => f.appointmentIEN !== currentAppointment?.appointmentIEN)
      .filter(f => f.status === STATUSES.ELIGIBLE).length > 0
  );
};
export { hasMoreAppointmentsToCheckInto };
