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

export function getNewAppointment(state) {
  return state.newAppointment;
}

export function getFormData(state) {
  return getNewAppointment(state).data;
}

export function getFormPageInfo(state, pageKey) {
  return {
    schema: getNewAppointment(state).pages[pageKey],
    data: getFormData(state),
    pageChangeInProgress: getNewAppointment(state).pageChangeInProgress,
  };
}
