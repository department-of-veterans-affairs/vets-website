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
  openModal: state?.data?.openModal,

  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  savedForms: state?.user?.profile?.savedForms,
  // Add the new feature flag: showMebEnhancements06
  // showMebEnhancements06: !!toggleValues(state)[
  //   FEATURE_FLAG_NAMES.showMebEnhancements06
  // ],
  showMeb1990EMaintenanceAlert:
    state.featureToggles.showMeb1990EMaintenanceAlert,
  showMeb1990ER6MaintenanceMessage:
    state.featureToggles.showMeb1990ER6MaintenanceMessage,
  showMebEnhancements06: state.featureToggles.showMebEnhancements06,
  showMebEnhancements08: state.featureToggles.showMebEnhancements08,
  toeDupContactInfoCall: state.featureToggles.toeDupContactInfoCall,
  toeLightHouseDgiDirectDeposit:
    state?.featureToggles?.toeLightHouseDGIDirectDeposit,
  toeHighSchoolInfoChange: state?.featureToggles?.toeHighSchoolInfoChange,
  user: state.user || {},
});
