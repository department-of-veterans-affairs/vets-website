import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';

export const getAppData = state => ({
  featureTogglesLoaded: state.featureToggles?.loading === false,
  formId: state?.form?.formId,
  isPersonalInfoFetchComplete: state.data?.personalInfoFetchComplete,
  isSponsorsFetchComplete: state.data?.fetchedSponsorsComplete,
  duplicateEmail: state.data?.duplicateEmail,
  duplicatePhone: state.data?.duplicatePhone,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  mebDpoAddressOptionEnabled: state.featureToggles.mebDpoAddressOptionEnabled,
  savedForms: state?.user?.profile?.savedForms,
  showMeb5490MaintenanceAlert:
    state?.featureToggles?.showMeb5490MaintenanceAlert,
  user: state.user || {},
});
