export const selectCurrentPage = state => state.referral.currentPage;
export const getSelectedSlot = state => state.referral.selectedSlot;

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

export function getDraftAppointmentInfo(state) {
  return {
    draftAppointmentInfo: state.referral.draftAppointmentInfo,
    draftAppointmentCreateStatus: state.referral.draftAppointmentCreateStatus,
  };
}

export function getReferrals(state) {
  return {
    referrals: state.referral.referrals,
    referralsFetchStatus: state.referral.referralsFetchStatus,
  };
}
