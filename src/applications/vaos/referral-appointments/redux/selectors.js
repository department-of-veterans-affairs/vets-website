export const selectCCAppointment = state => state.ccAppointment;
export const selectProvider = state => state.referral.selectedProvider;
export const selectProviderSortBy = state => state.referral.sortProviderBy;
export const selectCurrentPage = state => state.referral.currentPage;

export function getProviderInfo(state) {
  return {
    provider: state.referral.selectedProvider,
    providerFetchStatus: state.referral.providerFetchStatus,
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
