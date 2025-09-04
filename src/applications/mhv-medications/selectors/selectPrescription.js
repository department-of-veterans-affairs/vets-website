export const selectPrescriptionId = state =>
  state.rx.prescriptions?.prescriptionDetails?.prescriptionId;
export const selectPrescriptionApiError = state =>
  state.rx.prescriptions?.apiError;
