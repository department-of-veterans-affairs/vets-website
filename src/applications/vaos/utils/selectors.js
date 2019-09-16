export function selectConfirmedAppointment(state, id) {
  return (
    state.appointments?.confirmed?.find?.(appt => appt.uniqueId === id) || null
  );
}

export function selectPendingAppointment(state, id) {
  return (
    state.appointments?.pending?.find?.(appt => appt.uniqueId === id) || null
  );
}
