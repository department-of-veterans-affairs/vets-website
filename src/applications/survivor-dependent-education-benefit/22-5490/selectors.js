import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';

export const getAppData = state => {
  return {
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
    showMeb54901990eTextUpdate:
      state?.featureToggles.showMeb54901990eTextUpdate,
    user: state.user || {},
    meb1995InstructionPageUpdateV3:
      state?.featureToggles?.meb1995InstructionPageUpdateV3,
    meb5490Under18Flow: state?.featureToggles?.meb5490Under18Flow,
  };
};
