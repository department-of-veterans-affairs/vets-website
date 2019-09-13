export function selectPendingAppointment(state, id) {
  return (
    state.appointments?.pending?.find(appt => appt.uniqueId === id) || null
  );
}

export function getFormData(state) {
  return state.appointments.newAppointment.data;
}
