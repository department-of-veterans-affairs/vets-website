export function selectUnenrolledVaccine(state) {
  return state.unenrolledVaccine;
}

export function selectFormData(state) {
  return selectUnenrolledVaccine(state).data;
}

export function selectPageChangeInProgress(state) {
  return selectUnenrolledVaccine(state).pageChangeInProgress;
}
