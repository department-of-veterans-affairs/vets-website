import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';

export const getAppData = state => ({
  duplicateEmail: state.data?.duplicateEmail,
  duplicatePhone: state.data?.duplicatePhone,
  featureTogglesLoaded: state.featureToggles?.loading === false,
  formId: state?.form?.formId,
  isPersonalInfoFetchComplete: state.data?.personalInfoFetchComplete,
  isSponsorsFetchComplete: state.data?.fetchedSponsorsComplete,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  meb1995Reroute: state?.featureToggles?.meb1995Reroute,
  mebDpoAddressOptionEnabled: state?.featureToggles?.mebDpoAddressOptionEnabled,
  openModal: state?.data?.openModal,
  savedForms: state?.user?.profile?.savedForms,
  showMeb1990EMaintenanceAlert:
    state.featureToggles.showMeb1990EMaintenanceAlert,
  showMeb1990ER6MaintenanceMessage:
    state.featureToggles.showMeb1990ER6MaintenanceMessage,
  showMeb54901990eTextUpdate: state?.featureToggles.showMeb54901990eTextUpdate,
  toeDupContactInfoCall: state.featureToggles.toeDupContactInfoCall,
  toeHighSchoolInfoChange: state?.featureToggles?.toeHighSchoolInfoChange,
  user: state.user || {},
});
