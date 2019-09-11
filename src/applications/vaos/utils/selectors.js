export function selectPendingAppointment(state, id) {
  return (
    state.appointments?.pending?.find(appt => appt.uniqueId === id) || null
  );
}
