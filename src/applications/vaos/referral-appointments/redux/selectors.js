export const selectCurrentPage = state => state.referral.currentPage;
export const getSelectedSlot = state => state.referral.selectedSlot;

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

export function getReferral(state) {
  return {
    referrals: state.referral.referrals,
    referralFetchStatus: state.referral.referralFetchStatus,
  };
}
