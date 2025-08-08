export const selectCurrentPage = state => state.referral.currentPage;
export const getSelectedSlotStartTime = state =>
  state.referral.selectedSlotStartTime;

export function getProviderInfo(state) {
  return {
    provider: state.referral.selectedProvider,
    providerFetchStatus: state.referral.providerFetchStatus,
  };
}

export function getAppointmentCreateStatus(state) {
  return state.referral.appointmentCreateStatus;
}

export function getReferralAppointmentInfo(state) {
  return {
    referralAppointmentInfo: state.referral.referralAppointmentInfo,
    appointmentInfoLoading: state.referral.appointmentInfoLoading,
    appointmentInfoError: state.referral.appointmentInfoError,
    appointmentInfoTimeout: state.referral.appointmentInfoTimeout,
  };
}

export function getCachedDraftAppointmentInfo(state) {
  return state.referral.draftAppointmentInfo;
}

export function getReferrals(state) {
  return {
    referrals: state.referral.referrals,
    referralsFetchStatus: state.referral.referralsFetchStatus,
  };
}
