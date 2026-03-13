import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import { applicantIsAMinor } from './helpers';

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
  isMinor:
    state?.featureToggles?.mebBlockUnder18 &&
    applicantIsAMinor(state?.form?.data?.dob),
  mebBankInfoConfirmationField:
    state?.featureToggles?.mebBankInfoConfirmationField,
  mebBlockUnder18: state?.featureToggles?.mebBlockUnder18,
  openModal: state?.data?.openModal,
  savedForms: state?.user?.profile?.savedForms,
  showMeb1990EMaintenanceAlert:
    state.featureToggles.showMeb1990EMaintenanceAlert,
  user: state.user || {},
});
