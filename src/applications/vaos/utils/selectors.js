import { getAppointmentId } from './appointment';

export function selectConfirmedAppointment(state, id) {
  return (
    state.appointments?.confirmed?.find?.(
      appt => getAppointmentId(appt) === id,
    ) || null
  );
}

export function selectPendingAppointment(state, id) {
  return (
    state.appointments?.pending?.find?.(appt => appt.uniqueId === id) || null
  );
}

export function getFormData(state) {
  return state.newAppointment.data;
}

export function getFormPageInfo(state, pageKey) {
  return {
    schema: state.newAppointment.pages[pageKey],
    data: getFormData(state),
    pageChangeInProgress: state.newAppointment.pageChangeInProgress,
  };
}
